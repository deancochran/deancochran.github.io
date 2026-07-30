---
title: 'From Bluetooth Specification to TypeScript: Building an FTMS Protocol Codec'
slug: building-an-ftms-protocol-codec-from-the-bluetooth-specification
date: '2026-07-30'
image: /images/logo.webp
description: How I turned Bluetooth FTMS bytes into TypeScript values, with warnings and test examples for the awkward cases.
published: false
---

## Contents

## What the package does—and what the app still owns

[`@deancochran/ftms`](https://github.com/deancochran/ftms) is an MIT-licensed,
ESM-only TypeScript package for reading and writing Bluetooth Fitness Machine
Service (FTMS) bytes. FTMS is the Bluetooth service through which fitness
machines expose capabilities, measurements, status, ranges, and a Control Point
for commands such as requesting control or setting a target. The package is at
v0.2.0 and accepts `Uint8Array` and `ArrayBuffer`.

I built it to turn FTMS bytes into useful TypeScript values. The app still
owns the Bluetooth connection, subscriptions, retries and timeouts, and UI. That
keeps the same codec usable in Node 20+, modern bundlers, and modern React
Native/Metro without making it a BLE client.

The Control Point makes that boundary important. The codec can encode a request
and parse a response, but it cannot decide when it is safe to change a machine's
movement or resistance. The app must know whether the connection is live, which
response answers an operation, and whether the user has confirmed the action.

## Starting with documents, not guesses

I based the implementation on public documents and kept source links beside the
code and test examples. [FTMS 1.0](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/)
defines the service behavior. I used the public [GATT Specification Supplement
repository](https://bitbucket.org/bluetooth-SIG/public.git) at pinned revision
`3b58acd4d2446e68f5539acac46c3b4941a34747` for the field layouts.
[Errata Service Release 11](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=436247)
includes corrections E8991 and E9135. [Mandatory Errata Correction
23224](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=572314)
changes the rules about what an implementation must support; it does not change
FTMS bytes.

Those details matter. ESR11 and the pinned supplement establish that Set Target
Resistance is a signed 16-bit value with 0.1 resolution, and clarify the Cross
Trainer stride-count and unavailable step-rate definitions. Pinning the sources
means each test example can say which definition it follows instead of relying on
an old excerpt.

For every table, I note the field order, byte width, whether a number can be
negative, its scale, any special values, and the valid range. I put those rules in
a type, encoder or decoder, and a test example. That direct path from document to
code helps prevent a friendly API from quietly changing the protocol.

## UUIDs and checking what a machine supports

A Bluetooth characteristic is a named value identified by a UUID. Every FTMS
interaction starts with those assigned UUIDs. The service UUID is
`00001826-0000-1000-8000-00805f9b34fb`. Bluetooth's assigned 16-bit UUIDs expand
into that base UUID, so I use values such as Feature `0x2ACC`, the six
machine-data characteristics `0x2ACD` through `0x2AD2`, Control Point `0x2AD9`,
and Fitness Machine Status `0x2ADA`. The package also maps Training Status and
the five supported-range characteristics.

The Feature characteristic shows why a table needs precise code. It is exactly
eight bytes: two little-endian 32-bit words, one for machine features and one for
target-setting features. Little-endian means the least-significant byte comes
first. A short decoder makes that choice clear and exposes named capabilities so
callers do not need to remember bit positions:

```typescript
// Simplified excerpt: view and isBitSet are supplied by the surrounding decoder.
const machine = view.getUint32(0, true)
const target = view.getUint32(4, true)

return {
    cadenceSupported: isBitSet(machine, 1),
    powerTargetSettingSupported: isBitSet(target, 3),
}
```

This is a capability report, not permission to issue a command. The app still
needs to check advertised features and supported ranges before offering or trying
a control. The range bytes stay close to their definitions:

- Speed is an unsigned 16-bit value in hundredths of km/h.
- Inclination is a signed 16-bit value in tenths of a percent.
- Resistance and heart rate are 8-bit values.
- Power is a signed 16-bit value in watts.

Signed values can represent negatives. The decoders reject the wrong length, a
minimum above a maximum, or a zero increment with structured errors. That is safer
than handing an app a plausible-looking slider configuration.

## Reading optional fields in the right order

FTMS has measurements for treadmill, cross trainer, step climber, stair climber,
rower, and indoor bike. Their flags select optional fields. The selected fields
do not carry their own tags, so the decoder must read them in specification order.
Skipping a selected field, or continuing after a short field, shifts the cursor
and makes later bytes mean the wrong thing.

I use a `FieldReader` whose offset only moves forward. It reads little-endian
values, remembers when data runs out, and stops interpreting fields after a
failed read. The real helper also has the manual little-endian 24-bit read that
several FTMS values need.

```typescript
// Simplified excerpt: constructor and bounds-checked generic read are omitted.
class FieldReader {
    public offset: number
    public truncated = false

    public readUint16(field: string): number | null {
        return this.read(2, field, (offset) =>
            this.view.getUint16(offset, true)
        )
    }
}
```

Indoor Bike Data makes this concrete. Bit 0 is **More Data**; when it is clear,
instantaneous speed is present. Bit 2 adds cadence and bit 6 adds signed
instantaneous power. Speed is stored in hundredths of km/h, while the public
metric is metres per second, so I divide by 360. Cadence uses half-rpm units, so
I divide by 2. Power is signed watts, and total distance is an unsigned 24-bit
little-endian value. Each conversion lives beside the field that owns it instead
of in a consumer's UI.

Here is a complete Indoor Bike payload parsed by the package.

```typescript
import { parseFtmsIndoorBikeMeasurement } from '@deancochran/ftms'

const bytes = Uint8Array.of(0x44, 0x00, 0xe8, 0x03, 0xb4, 0x00, 0xfa, 0x00)
const measurement = parseFtmsIndoorBikeMeasurement(bytes)

measurement.metrics.speedMps // about 2.78
measurement.metrics.cadenceRpm // 90
measurement.metrics.powerWatts // 250
```

The flags are `0x0044`. Bit 0 is clear, so speed is present; bits 2 and 6 add
cadence and power. `0x03e8` is 1000 hundredths of km/h: 10 km/h, or about
2.78 m/s. `0x00b4` is 180 half-rpm units, so cadence is 90 rpm. `0x00fa` is
250 signed watts. The package returns those usable values and any warnings.

The same care applies elsewhere. Inclination is stored in tenths of a percent and
divided by 10. Simulation grade is a signed 16-bit value in hundredths of a
percent and divided by 100. Metabolic equivalent divides by 10, and rower stroke
rate divides by 2. Reading signed power or grade as unsigned can turn a small
negative into a large, believable positive number.

### Absence has meaning too

Some special values mean there is no measurement. I call these unavailable
sentinels. Where a field says so, values such as `0xffff`, `0xff`, or certain
signed `0x7fff` values become `null` and add a warning. I do not assume every
maximum integer is unavailable: the meaning belongs to that field's definition.

More Data also says a record can span notifications. Putting notifications back
together depends on connection state, ordering, and timeouts, so the decoder
leaves that to the caller.

The result is usable metrics with structured warnings for truncation, unavailable
values, More Data, reserved flags or values (bits or values the specification has
not assigned), trailing bytes, and unknown opcodes.

A malformed packet should not look like a complete workout because a few early
fields happened to decode.

## Turning Control Point requests into TypeScript

Types matter when writing Control Point bytes, not only when reading them. Each
request begins with a one-byte operation code, or opcode. Instead of accepting an
opcode plus an array, I use a TypeScript union where `op` chooses the request
shape. The package covers FTMS 1.0 request values `0x00` through `0x14`. A target
speed cannot be passed to `requestControl`, which takes no parameter.

```typescript
export type FtmsControlRequest =
    | { op: 'requestControl' }
    | { op: 'setTargetSpeed'; speedKph: number }
    | { op: 'setTargetPower'; powerWatts: number }
    | {
          op: 'setIndoorBikeSimulation'
          windSpeedMps: number
          gradePercent: number
          crr: number
          cwKgPerM: number
      }
```

The encoder checks finite values, signed and unsigned bounds, the required step
size, and the required number of values before it creates a byte payload.
Target power is a signed 16-bit value in watts, target speed is an unsigned
16-bit value in hundredths of km/h, and target distance uses a three-byte integer.
Indoor-bike simulation uses signed wind and grade, plus fixed-scale rolling and
wind resistance. These constraints belong in the encoder, not in hopeful comments
at each call site.

`tryEncodeFtmsControlRequest` returns either `{ ok: true, value }` or
`{ ok: false, error }`; `encodeFtmsControlRequest` is the throwing convenience
version. A caller can keep an invalid input visible in its own error handling:

```typescript
import { tryEncodeFtmsControlRequest } from '@deancochran/ftms'

const encoded = tryEncodeFtmsControlRequest({
    op: 'setTargetPower',
    powerWatts: 250,
})

if (encoded.ok) {
    console.log([...encoded.value]) // [0x05, 0xfa, 0x00]
}
```

The output starts with opcode `0x05`, then `0xfa, 0x00` stores 250 in
little-endian order. Because power is signed, -100 becomes the verified
`[0x05, 0x9c, 0xff]`. Reserved request values are rejected instead of accepting
an arbitrary byte because it happens to fit.

### Matching a response to a request

Control Point responses have the byte shape
`[0x80, requestOpcode, resultCode, optionalParameter...]`. Result codes `0x01`
through `0x05` cover success through control not permitted. Spin Down is the
one response that may also include target speeds. Unexpected lengths, reserved
request or result values, and unknown opcodes produce warnings or are rejected
instead of being treated as successful.

FTMS responses do not include a unique ID that links them to a request. The app
must therefore:

- send one Control Point request at a time and wait for its Bluetooth indication
  (the response);
- handle timeouts, disconnects, and Control Permission Lost (`0xff`);
- check features and ranges; and
- require suitable user confirmation before movement or resistance changes.

Encoding bytes is not authority to perform the action those bytes request.

## Returning warnings and testing edge cases

It would be easy for a decoder to return only a convenient object or throw on
every problem. FTMS needs a middle path. A notification can be partial, a device
can send a reserved bit, and an unavailable value can still be well-formed.
Returning metrics with warnings lets the app choose how to display, log, retry,
or handle those cases. Feature and range decoding, plus the non-throwing control
encoder, return either `{ ok: true, value }` or `{ ok: false, error }` so invalid
input is not silently repaired.

I turned those document rules into shipped test examples in
`conformance/v1/vectors.json`. The JSON Schema checks their shape. The examples
record the exact source revision and any correction used. They cover feature bits,
ranges, every Control Point request, response and result cases, all six measurement
types, Training Status, and Machine Status. They also cover malformed, truncated,
reserved, unavailable, More Data, and trailing-byte cases. Tests bind the examples
to the implementation, so table rows and edge cases stay regression tests.

These are regression tests, not official Bluetooth qualification or Bluetooth
Profile Tuning Suite (PTS) evidence. They show what this package reads and writes
against its pinned public sources.

I also test the package as users receive it, not only the source. Those checks
verify which files are published, TypeScript declarations and source maps, JSON
exports, browser bundling, and TypeScript use. They also make sure the runtime
does not accidentally depend on Node globals or BLE/React Native libraries.

## What I would carry into the next codec

The main lesson from FTMS is simple. Flags decide what to read and in what order.
Scales turn stored integers into usable units. Unavailable values are specific to
each field. A Control Point request must follow its exact byte layout; it is not
just any byte array.

I ended up with a focused library that turns documented FTMS bytes into TypeScript
values, with source links and test examples nearby.

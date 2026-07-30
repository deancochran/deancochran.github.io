---
title: 'From Bluetooth Specification to TypeScript: Building an FTMS Protocol Codec'
slug: building-an-ftms-protocol-codec-from-the-bluetooth-specification
date: '2026-07-30'
image: /images/logo.webp
description: How I translated the Bluetooth Fitness Machine Service wire format into runtime-neutral TypeScript codecs with explicit diagnostics and conformance vectors.
published: false
---

## Contents

## The boundary: bytes in, facts out

[`@deancochran/ftms`](https://github.com/deancochran/ftms) is an MIT-licensed,
ESM-only TypeScript package for decoding and encoding the Bluetooth Fitness
Machine Service (FTMS). FTMS is the Bluetooth service through which fitness
machines expose capabilities, measurements, status, ranges, and a Control Point
for procedures such as requesting control or setting a target. The package is at
v0.2.0 and accepts `Uint8Array` and `ArrayBuffer`; that small input surface is a
deliberate part of its design.

I wanted the package to turn protocol bytes into useful, normalized facts without
deciding how an application obtains those bytes. It therefore targets Node 20+,
modern bundlers, and modern React Native/Metro, but it does not own BLE
connection or discovery, GATT subscriptions, indication handling, timers,
response correlation, logging, UI, application policy, or React Native-specific
APIs. A browser, mobile application, or Node program can place its own transport
around the same codec.

That boundary is especially important for the Control Point. A codec can tell a
caller how to encode a request and parse a response. It cannot safely decide when
someone should change a machine's movement or resistance, whether the connection
is still live, or which pending operation an indication belongs to. Keeping those
choices outside the package makes the protocol work portable while leaving safety
and lifecycle authority with the caller.

## Starting with documents, not guesses

I grounded the implementation's wire format in public documents and recorded
their provenance alongside the code and conformance vectors. The primary source
is the [Bluetooth Fitness
Machine Service 1.0 specification](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/).
The conformance corpus also pins definitions from the Bluetooth SIG public [GATT
Specification Supplement repository](https://bitbucket.org/bluetooth-SIG/public.git)
at revision `3b58acd4d2446e68f5539acac46c3b4941a34747`, plus [Errata Service Release
11](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=436247)
(E8991 and E9135) and [Mandatory Errata Correction
23224](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=572314).

Those links are sources, not an endorsement or a claim of Bluetooth SIG
compliance. They matter because a table's revision can change a correct
implementation. ESR11 and the pinned supplement, for example, establish that
Set Target Resistance is a signed 16-bit value at 0.1 resolution, and clarify the
Cross Trainer stride-count and unavailable step-rate definitions. Mandatory
Correction 23224 replaces general conformance language; it does not change FTMS
wire layouts. Pinning all of this lets a vector say which definition it represents
instead of treating an old prose excerpt as timeless truth.

My translation process was deliberately mechanical: identify a table's field
order, width, integer kind, resolution, special values, and validity constraints;
then make those facts visible in a type, encoder, decoder, and test case. This is
less glamorous than starting from an application API, but it prevents a friendly
object model from quietly changing the protocol beneath it.

## UUIDs and the first capability question

Every FTMS interaction begins with assigned UUIDs. The service UUID is
`00001826-0000-1000-8000-00805f9b34fb`. Bluetooth's assigned 16-bit UUIDs can be
expanded into that base UUID, so after establishing the convention I use values
such as Feature `0x2ACC`, the six machine-data characteristics `0x2ACD` through
`0x2AD2`, Control Point `0x2AD9`, and Fitness Machine Status `0x2ADA`. The
package also maps Training Status and the five supported-range characteristics.

The Feature characteristic is an excellent example of why a table must become
code precisely. It is exactly eight bytes: two little-endian 32-bit words, one
for machine features and one for target-setting features. A short decoder makes
the byte-order choice explicit and exposes named capabilities rather than
requiring each consumer to remember bit positions:

```typescript
// Simplified excerpt: view and isBitSet are supplied by the surrounding decoder.
const machine = view.getUint32(0, true)
const target = view.getUint32(4, true)

return {
    cadenceSupported: isBitSet(machine, 1),
    powerTargetSettingSupported: isBitSet(target, 3),
}
```

That is a capability report, not permission to issue a command. An application
still needs to inspect advertised features and supported ranges before offering or
attempting a control. For ranges, I retained the wire definitions: speed is an
unsigned 16-bit value divided by 100 in km/h; inclination is signed 16-bit divided
by 10 percent; resistance and heart rate are 8-bit; and power is signed 16-bit
watts. Decoders reject a wrong length, a minimum above a maximum, and a zero
increment with typed result errors. Making impossible ranges explicit is better
than handing an application a plausible-looking slider configuration.

## Reading flags as a cursor, not a schema guess

FTMS has measurements for treadmill, cross trainer, step climber, stair climber,
rower, and indoor bike. Their flags select optional fields. Crucially, selected
fields do not carry individual tags: a decoder must consume them in the exact
order in the specification. Skipping a selected field, or trying to recover after
a short field, would shift the cursor and reinterpret unrelated later bytes.

I model this with a `FieldReader` whose offset moves only forward. It knows the
little-endian primitives, carries truncation state, and stops field interpretation
after a failed read. The real helper also includes the manual little-endian
24-bit read needed by several FTMS values.

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

Indoor Bike Data makes the consequences concrete. Bit 0 is **More Data**; when it
is clear, instantaneous speed is present. Bit 2 adds cadence and bit 6 adds
signed instantaneous power. The wire speed is hundredths of km/h, but the public
metric is metres per second, so I divide the raw value by 360. Cadence has a
0.5-rpm resolution, so it is divided by 2. Power is signed watts, and total
distance is an unsigned 24-bit little-endian value. Each conversion belongs next
to the field that owns it, rather than being spread through a consumer's UI.

The same discipline applies beyond cycling: inclination fields at 0.1% use a
`/10` scale, while Indoor Bike Simulation grade is signed `int16` at 0.01% and
uses `/100`. Metabolic equivalent uses `/10`, and rower stroke rate uses `/2`.
Signedness is not cosmetic. Decoding a signed power or grade with an unsigned read
can make a small negative value look like a large, valid positive one.

### Absence has meaning too

Some wire values are unavailable sentinels, not measurements. Where a field's
definition says so, values such as `0xffff`, `0xff`, or certain signed `0x7fff`
values become `null` and produce a diagnostic. I do not apply a blanket rule that
every maximum integer means unavailable: sentinel meaning belongs to a particular
field and definition.

Likewise, More Data says that a record can span notifications. The decoder reports
that condition but does not buffer or reassemble notifications. That would require
connection lifetime, ordering, and timeout choices that belong to the transport or
application. A caller can retain bytes and choose an appropriate policy without
the codec pretending it has a complete record.

The outcome is normalized metrics accompanied by conservative diagnostics:
truncation, unavailable values, More Data, reserved flags or values, trailing
bytes, and unknown opcodes are observable. A malformed packet does not become a
complete-looking workout merely because a few early fields decoded successfully.

## Turning the Control Point table into a union

The Control Point is where typed construction is as valuable as parsing. Rather
than exposing a generic opcode plus number array, I represented every FTMS 1.0
request opcode from `0x00` through `0x14` as a member of the
`FtmsControlRequest` discriminated union. The `op` selects the payload shape, so
a target speed cannot accidentally be supplied where a request-control procedure
has no parameter.

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

The encoder validates finite values, signed and unsigned bounds, exact supported
resolution, and tuple cardinality before it allocates a wire representation.
Target power is signed `int16` watts; target speed is `uint16` at 0.01 km/h; and
target distance needs a manual `uint24`. The indoor-bike simulation payload is a
useful reminder that one request can combine signed wind and grade with scaled
coefficients. These constraints belong in one encoder, not as a set of hopeful
comments at every call site.

The non-throwing `tryEncodeFtmsControlRequest` returns an explicit result union;
`encodeFtmsControlRequest` is the throwing convenience variant. A caller can make
an invalid input visible in its own error handling:

```typescript
const encoded = tryEncodeFtmsControlRequest({
    op: 'setTargetPower',
    powerWatts: 250,
})
```

This approach also makes reserved request values rejectable rather than allowing
an arbitrary byte through because it happens to fit in an octet.

### Responses are not a transaction layer

Control Point responses have the wire shape
`[0x80, requestOpcode, resultCode, optionalParameter...]`. Result codes `0x01`
through `0x05` cover success through control not permitted. Spin Down is the
response exception that can carry target speeds; unexpected lengths, reserved
request or result values, and unknown opcodes are diagnosed or rejected rather
than coerced into success.

There is no transaction identifier in an FTMS response. That protocol fact drives
the package boundary: the caller must serialize Control Point procedures, await
the matching indication, and deal with timeouts and disconnects. It must also
handle Control Permission Lost (`0xff`), check features and ranges, and require
suitable user confirmation before movement or resistance changes. Encoding bytes
is not authority to perform the action those bytes request.

## Diagnostics as an API, vectors as evidence

It is tempting for a decoder to return only a convenient object or throw on every
problem. FTMS needs a middle path. Notifications may be partial, a device may send
a reserved bit, and an unavailable value can be perfectly well-formed. Returning
metrics plus diagnostics lets an application distinguish those cases and choose
its own display, logging, retry, or safety policy. Feature and range decoding, and
the non-throwing control encoder, use explicit result unions for the same reason:
invalid input is data that should not be silently repaired.

I captured the translation in the shipped `conformance/v1/vectors.json` corpus
and its JSON Schema. It records source identifiers, revisions, and errata, then
covers feature bits, ranges, every Control Point request, response and result
cases, all six measurement types, Training Status, and Machine Status. It also
covers malformed, truncated, reserved, unavailable, More Data, and trailing-byte
cases. Tests bind those vectors to the implementation, turning individual table
rows and edge cases into regression evidence.

That is not Bluetooth qualification, PTS evidence, or a claim of compliance. It
is a reproducible statement about what this package decodes and encodes against
its pinned public sources. The package verification goes further at the packaging
boundary: it checks the packed-file allowlist, declarations and source maps, the
absence of Node-specific runtime globals and BLE or React Native runtime imports,
ESM JSON exports, browser bundling, and TypeScript consumption.

## What I would carry into the next codec

The durable lesson from FTMS is that a protocol API should preserve uncertainty
instead of smoothing it away. A flags table is a sequential parser contract. A
scale is a unit conversion with a specified integer representation. A sentinel is
field-specific absence. A Control Point request is a constrained procedure, not
just a byte array. Once those distinctions are reflected in types and diagnostics,
the runtime-neutral core becomes smaller and easier to trust.

For `@deancochran/ftms`, the result is not a BLE client and not an application
workflow. It is a carefully bounded bridge from documented FTMS bytes to TypeScript
values, with provenance and conformance vectors close at hand. That separation
leaves transport and safety decisions where they can be made with the context the
codec does not have.

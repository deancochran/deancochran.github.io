---
title: 'My FTMS Package'
slug: building-an-ftms-protocol-codec-from-the-bluetooth-specification
date: '2026-07-30'
image: /images/ftms-exercise-bikes.jpg
description: 'Read fitness machine data and build control commands with TypeScript.'
published: true
---

## Contents

## What the package does

![Two flows show that the application manages Bluetooth: it passes machine data to the FTMS package to read, and it sends command bytes built by the package to the machine.](/images/ftms-protocol-flow.svg)

I built [`@deancochran/ftms`](https://github.com/deancochran/ftms) to read and write Fitness Machine Service (FTMS) bytes as TypeScript values. This kind of translation is the job of a codec.

The package accepts `Uint8Array` or `ArrayBuffer` data. It decodes measurements and reports warnings. It also checks control inputs and encodes requests.

It is not a Bluetooth Low Energy (BLE) client. Your application still handles:

- Finding devices and subscribing to updates.
- Running operations in the right order.
- Handling timeouts and matching responses to requests.
- Keeping the user safe.

I make no claim of Bluetooth qualification or PTS testing. I also do not claim support for every device.

## The specifications I used

I worked from [FTMS 1.0](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/) and the public [GATT Specification Supplement repository](https://bitbucket.org/bluetooth-SIG/public.git). I pinned the repository to commit `3b58acd4d2446e68f5539acac46c3b4941a34747`.

I used the resistance and cross-trainer corrections from [ESR11](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=436247). Correction 23224 changes the wording of conformance requirements. It does not change the byte layouts.

## Reading a measurement

FTMS flags tell the decoder which fields are present. The decoder must read those fields in the order set by the specification.

The Indoor Bike example below uses the flags `0x0044`. Bit 0 is clear. This means instantaneous speed is present. Bits 2 and 6 add cadence and power.

Here is how the field values translate:

- Speed: `0x03e8` is 10 km/h, or about 2.78 m/s.
- Cadence: `0x00b4` is 180 half-rpm, or 90 rpm.
- Power: signed `0x00fa` is 250 W.

```typescript
import { parseFtmsIndoorBikeMeasurement } from '@deancochran/ftms'

const measurement = parseFtmsIndoorBikeMeasurement(
    Uint8Array.of(0x44, 0x00, 0xe8, 0x03, 0xb4, 0x00, 0xfa, 0x00)
)

measurement.metrics.speedMps // about 2.78
measurement.metrics.cadenceRpm // 90
measurement.metrics.powerWatts // 250
```

Reading fields in the right order keeps later values in the right place. An absent optional field must not shift those values.

The decoders also report these cases:

- Truncated data.
- Reserved flags.
- Unavailable values.
- Trailing bytes.
- More Data.

Your application decides how to show these warnings or recover from them. The codec does not automatically reassemble More Data. That needs the application to track ordering and timeouts on the connection.

## Writing a control request

A correctly encoded request follows the byte format. It does not automatically have the machine's permission to run.

For example, a target power of 250 W encodes as `[0x05, 0xfa, 0x00]`. The first byte is opcode `0x05`. The next two bytes hold a signed 16-bit value. They use little-endian order: the least-significant byte comes first.

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

Your application still needs to manage the request:

- Check the machine's features and ranges before sending it.
- Get appropriate user confirmation before sending it.
- Send only one Control Point procedure at a time.
- Wait for the matching indication.
- Handle timeouts, disconnections, and loss of permission.

Encoding a command cannot make it safe to perform.

## What I tested

My tests check for regressions in six machine-data parsers and the status and control codecs. They also cover versioned JSON examples with a schema. The cases include malformed, truncated, reserved, and unavailable data.

I also check the packaged build, the browser bundle, and code that uses the package from TypeScript.

These checks help catch regressions. They are not Bluetooth qualification. They do not prove that the package works with real devices.

## Closing thought

The useful work is keeping the specification tables, bytes, units, and tests close together. The codec handles the translation. The application handles the Bluetooth connection. It also remains responsible for the person using the machine.

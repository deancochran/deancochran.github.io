---
title: 'From Bluetooth Specification to TypeScript: Building an FTMS Protocol Codec'
slug: building-an-ftms-protocol-codec-from-the-bluetooth-specification
date: '2026-07-30'
image: /images/logo.webp
description: 'How I turn Bluetooth FTMS bytes into typed values, wire-valid control inputs, and useful warnings.'
published: true
---

## Contents

## From a public protocol to code

![A flow from FTMS specification tables through TypeScript codecs and diagnostics to an application-owned Bluetooth connection](/images/ftms-protocol-flow.svg)

I built [`@deancochran/ftms`](https://github.com/deancochran/ftms) to read and write Fitness Machine Service (FTMS) bytes as TypeScript values. Its boundary is deliberate: it accepts `Uint8Array` or `ArrayBuffer`, decodes measurements, validates control inputs, encodes requests, and reports useful warnings.

It is not a BLE client. Callers own discovery, subscriptions, operation ordering, timeouts, response matching, and user safety. The package makes no qualification, PTS, or universal-device-compatibility claim.

I worked from [FTMS 1.0](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/) and the public [GATT Specification Supplement repository](https://bitbucket.org/bluetooth-SIG/public.git), pinned at `3b58acd4d2446e68f5539acac46c3b4941a34747`. [ESR11](https://www.bluetooth.org/DocMan/handlers/DownloadDoc.ashx?doc_id=436247) supplies the resistance and cross-trainer corrections I used. Correction 23224 changes conformance language, not byte layouts.

## The byte-level translation

FTMS flags select fields; selected fields must be read in the specified order. In this Indoor Bike payload, `0x0044` has bit 0 clear, so instantaneous speed is present; bits 2 and 6 add cadence and power. `0x03e8` is 10 km/h, or about 2.78 m/s; `0x00b4` is 180 half-rpm, or 90 rpm; and signed `0x00fa` is 250 W.

```typescript
import { parseFtmsIndoorBikeMeasurement } from '@deancochran/ftms'

const measurement = parseFtmsIndoorBikeMeasurement(
    Uint8Array.of(0x44, 0x00, 0xe8, 0x03, 0xb4, 0x00, 0xfa, 0x00)
)

measurement.metrics.speedMps // about 2.78
measurement.metrics.cadenceRpm // 90
measurement.metrics.powerWatts // 250
```

That ordering rule prevents a missing optional field from shifting every later value. Decoders also surface cases such as truncation, reserved flags, unavailable values, trailing bytes, and More Data; callers decide how to present or recover from them. More Data is not automatically reassembled because that needs connection-level ordering and timeouts.

## Commands are not a BLE client

A control request is wire-valid, not automatically machine-authorized. For example, target power 250 encodes as `[0x05, 0xfa, 0x00]`: opcode `0x05`, followed by a signed 16-bit value in little-endian order (least-significant byte first).

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

Before sending it, callers check features and ranges, send only one Control Point procedure at a time, wait for the matching indication, handle timeout, disconnect, or permission loss, and gain appropriate user confirmation. Encoding a command cannot make it safe to perform.

## What I tested

My regression evidence covers six machine-data parsers, status and control codecs, and versioned JSON examples with a schema. The cases include malformed, truncated, reserved, and unavailable data. I also check the packed artifact, browser bundle, and TypeScript consumer. This is regression evidence, not Bluetooth qualification or device-interoperability proof.

## Closing thought

The useful work is keeping public tables, bytes, units, and tests close together. The codec owns the translation; the application owns the Bluetooth conversation and the person using the machine.

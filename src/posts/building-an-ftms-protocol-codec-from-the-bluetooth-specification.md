---
title: 'My FTMS Package'
slug: building-an-ftms-protocol-codec-from-the-bluetooth-specification
date: '2026-07-30'
image: /images/ftms-exercise-bikes.jpg
description: 'Read fitness machine data and build control commands with TypeScript.'
published: true
---

## Contents

## What is FTMS?

Fitness Machine Service, or FTMS, is a Bluetooth standard used by exercise equipment such as indoor bikes and cross trainers. It gives apps a common way to receive things like speed, cadence, and power from a machine.

The Bluetooth details are still a little fiddly. Machines send compact byte data, while an app usually wants useful values it can display or act on. That is the gap [`@deancochran/ftms`](https://github.com/deancochran/ftms) is meant to fill.

## What the package handles

The package turns raw FTMS data into TypeScript values. Give it the bytes from a machine measurement and it can return values such as speed in metres per second, cadence in RPM, and power in watts.

It can also build the bytes for supported control commands. That is useful when an app wants to ask a machine to do something, such as set a target power.

The package is not a Bluetooth client. Your app still finds the machine, subscribes to its updates, sends commands, and decides when a command is appropriate. It also owns the safety and user-experience decisions around controlling equipment.

For the details behind the format, the [official FTMS specification](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/) is the source to consult.

## Reading a measurement

A measurement can contain different values depending on what the machine reports. The decoder takes care of pulling the available values out of the raw data, so the calling code can work with something more familiar.

```typescript
import { parseFtmsIndoorBikeMeasurement } from '@deancochran/ftms'

const measurement = parseFtmsIndoorBikeMeasurement(
    Uint8Array.of(0x44, 0x00, 0xe8, 0x03, 0xb4, 0x00, 0xfa, 0x00)
)

measurement.metrics.speedMps // about 2.78
measurement.metrics.cadenceRpm // 90
measurement.metrics.powerWatts // 250
```

In a real app, those values might update the ride screen, feed a workout record, or help drive another part of the experience. The package keeps the byte parsing in one place instead of making every caller repeat it.

## Building a control command

When an app needs to control a compatible machine, it can ask the package to build a command instead of assembling the bytes by hand.

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

That result can be passed to the Bluetooth code in your app. Before it sends a command, the app needs control or permission from the machine. It should send one request at a time and wait for the machine's response before sending another. It also needs to check what the machine supports, make sure the request makes sense for the user, and handle the connection when anything goes wrong.

## Keeping the boundary simple

The package focuses on translating FTMS bytes to and from useful TypeScript values. Your app handles the Bluetooth connection and the decisions that come with using a real fitness machine. Keeping those jobs separate makes the code easier to understand and gives the app control where it matters.

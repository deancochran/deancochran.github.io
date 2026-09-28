---
title: 'My FTMS Package'
slug: my-ftms-package
date: '2026-07-30'
image: /images/ftms-exercise-bikes.jpg
description: 'Making FTMS easier to use across languages.'
published: true
---

## What is FTMS?

Fitness Machine Service, or FTMS, is a Bluetooth standard used by exercise equipment such as indoor bikes and cross trainers. It gives apps a common way to receive things like speed, cadence, and power from a machine.

The Bluetooth part can still be fiddly. Machines send compact byte data, while an app usually wants useful values it can display or act on. My [FTMS project](https://github.com/deancochran/ftms) is about translating between those two worlds.

## A bigger goal than one package

I started with TypeScript, but I do not want FTMS support to depend on one language or one Bluetooth library. The same translation should be useful to an app, a native tool, or equipment and simulator software.

For example, an app could use decoded measurements for a ride screen. A simulator could use the same rules to create measurements for another app to read.

## Encode and decode

Decoding means taking the bytes from a machine and turning them into useful values. Encoding turns values and commands back into FTMS bytes.

Keeping both directions together matters. It makes the rules easier to share between software that reads FTMS data and software that creates it.

## Shared rules, different languages

I am building shared, language-neutral rules and examples so independent implementations can agree on what the same bytes mean. That gives each project room to use its own language and Bluetooth stack.

This is especially useful outside Node. The C implementation can be used from C or C++ without bringing in a Node dependency. The app still owns the Bluetooth connection and decides when it is appropriate to send a control request.

## Where it is today

So far, I have implemented FTMS encoding and decoding in TypeScript and C. The TypeScript package is available on [npm](https://www.npmjs.com/package/@deancochran/ftms), although the newest bidirectional work is not released there yet. The C work is also an unreleased source candidate.

Swift and Kotlin are future work. .NET and Python are longer-term possibilities. I am keeping the project focused on making the shared translation understandable and reusable as it grows.

The [project README](https://github.com/deancochran/ftms#readme) has the current details. The goal is to let you use FTMS in the language that fits your project.

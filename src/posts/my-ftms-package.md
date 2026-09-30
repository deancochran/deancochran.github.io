---
title: 'My FTMS Libraries'
slug: my-ftms-package
date: '2026-07-30'
image: /images/ftms-exercise-bikes.jpg
description: 'Open-source FTMS protocol libraries for apps, firmware, and diagnostic tools.'
published: true
---

What started as my TypeScript package has grown into nine independently distributed FTMS libraries, plus documentation for choosing and integrating them.

The goal is still modest: make the protocol work repeatable so an application can spend its effort on the workout screen, device tooling, or firmware around it.

## FTMS is the protocol, not the whole application

Fitness Machine Service (FTMS) is a Bluetooth service used by equipment such as indoor bikes, treadmills, rowers, and cross trainers. It carries measurements, feature declarations, supported ranges, statuses, and control messages.

The library translates protocol messages into useful values and back again. The application handles the Bluetooth connection and subscriptions, then owns the command lifecycle. Encoding a command does not send it or authorize it; that decision stays with the application.

## From bytes to a useful screen

Here is the small, practical path I want these packages to make easier. An application receives an Indoor Bike Measurement notification from the Bluetooth layer:

`44 00 10 0e b4 00 fa 00`

The packet is an illustrative example, not a capture from a particular machine. A decoder turns it into a speed of 10 m/s, cadence of 90 rpm, and power of 250 W. A ride screen can render those values, while a logging tool can record them with the time and connection state supplied by its host application.

Just as important, the packet does not contain heart rate. That should remain absent (`null` in a suitable high-level representation), not become zero. If the final byte is removed, the power value is truncated and should not silently become a fresh 250 W reading. The application can show an unavailable value, preserve an explicit diagnostic in a log, or wait for the next complete notification. It owns freshness; the library makes the wire-level condition visible.

Features and ranges can make an interface more honest, too. If discovery reports a supported power range of 0–500 W in 10 W increments, a UI could offer values on that grid instead of a free-form field. Missing, unread, or malformed information is different from “unsupported,” so the UI does not need to guess.

For protocol tooling, the reverse direction is useful as well: an example 250 W request encodes as `05 fa 00`, and the synthetic response `80 05 01` decodes as success. Those example bytes can drive a simulator, fixture, or parser test without needing equipment connected.

## Useful places to start

- A custom workout dashboard can use decoded notifications for the same ride screen on a web or phone application, while its host platform handles Bluetooth.
- An offline packet analyzer can replay saved notifications to investigate a bug or validate a UI change without needing a bike for every run.
- A simulator or equipment-side tool can encode measurements and control responses for another application to consume.

## Nine ports, different practical homes

The implementations share protocol fixtures and concepts, but each belongs in its own ecosystem. This release snapshot is current as of September 30, 2026.

- **TypeScript and JavaScript:** <a href="https://deancochran.github.io/ftms/start/typescript/" rel="external"><code>@deancochran/ftms</code> 0.4.0</a> on npm fits a web, Node, or Electron application that already has a Bluetooth transport and needs decoded measurements for a dashboard or session log.
- **C and C++:** the <a href="https://deancochran.github.io/ftms/start/c/" rel="external">C99 <code>c-v0.2.0</code> source archive</a> is useful where a small native library belongs near firmware, an embedded integration, or a C/C++ diagnostic client. C++ can consume the C interface rather than requiring a separate C++ port.
- **Swift:** the <a href="https://deancochran.github.io/ftms/start/swift/" rel="external">tag-pinned SwiftPM <code>swift-v0.1.0</code> release</a> gives an Apple-native project protocol values while CoreBluetooth and app lifecycle remain outside the library.
- **Kotlin and Java:** <a href="https://deancochran.github.io/ftms/start/kotlin/" rel="external"><code>io.github.deancochran:ftms:0.1.0</code></a> is a Maven Central JVM library for Kotlin, Java, and Android-oriented work.
- **Python:** <a href="https://deancochran.github.io/ftms/start/python/" rel="external"><code>deancochran-ftms</code> 0.1.0a2</a> is an evolving PyPI alpha. It can decode and encode messages, inspect ranges, and interpret declared features and ranges, which is useful for an exploratory decoder or analysis script.
- **Rust:** <a href="https://deancochran.github.io/ftms/start/rust/" rel="external"><code>ftms</code> 0.1.0</a> is published on crates.io. The released, allocation-free <code>no_std</code> library works with raw wire values, range inspection, feature interpretation, display-ready feature and measurement values, and bounded record assembly—useful building blocks for an embedded or protocol-focused tool. Later display-ready range, control, and status views are not part of that release.
- **Dart and Flutter:** <a href="https://pub.dev/packages/deancochran_ftms/versions/0.1.0" rel="external"><code>deancochran_ftms</code> 0.1.0</a> on pub.dev can sit behind a Flutter interface, converting transport notifications into values a mobile screen or local workout history can use.
- **Go:** <a href="https://pkg.go.dev/github.com/deancochran/ftms/packages/go@v0.1.0" rel="external"><code>github.com/deancochran/ftms/packages/go</code> v0.1.0</a> is available through the Go module proxy for a command-line decoder, protocol replay tool, or service-side ingestion experiment. It includes raw codecs, range inspection, and feature interpretation; display-ready measurement views are not released.
- **C# and .NET:** <a href="https://www.nuget.org/packages/DeanCochran.Ftms/0.1.0-alpha.1" rel="external"><code>DeanCochran.Ftms</code> 0.1.0-alpha.1</a> is a NuGet prerelease for a .NET desktop diagnostic or integration tool. It includes wire codecs, range inspection, feature evidence, and display-ready views, but not record assembly or a Bluetooth implementation.

## Start with the released package you can use

The <a href="https://deancochran.github.io/ftms/project/releases/" rel="external">release matrix</a> is the current record of package versions and what each release includes. Start with the <a href="https://deancochran.github.io/ftms/start/typescript/" rel="external">TypeScript quickstart</a> for the shortest runnable measurement example, or open the linked package for the language that fits your project.

After that, the <a href="https://deancochran.github.io/ftms/integration/cookbook/" rel="external">integration cookbook</a> walks through measurements, capabilities, ranges, diagnostics, and control messages without requiring Bluetooth hardware. The <a href="https://github.com/deancochran/ftms" rel="external">source project</a> is open source under the MIT license.

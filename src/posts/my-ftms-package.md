---
title: 'My FTMS Package'
slug: my-ftms-package
date: '2026-07-30'
image: /images/ftms-exercise-bikes.jpg
description: 'Open-source FTMS libraries for fitness apps, devices, and tools.'
published: true
---

I've put a lot of work into my FTMS project recently. It began as a TypeScript package. Now it includes libraries for several languages and a <a href="https://deancochran.github.io/ftms/" rel="external">documentation site</a> to make them easier to use.

The point is straightforward: give fitness apps, devices, and tools a reusable way to work with FTMS without making every project start from packet parsing.

## What is FTMS?

Fitness Machine Service, or FTMS, is a Bluetooth standard used by equipment such as indoor bikes, treadmills, and cross trainers. It gives software a common way to receive things like speed, cadence, power, and machine status.

The standard helps, but it does not remove all the work. Apps still need to turn compact data into useful values. They need to handle optional or missing values too. Repeating that work in every app is easy to get wrong and takes attention away from the actual product.

That is why I am building this project as a set of focused libraries. A workout UI can use decoded measurements to update a ride screen. A firmware tool can inspect the same information. A simulator can create measurements for another application to read.

## What the libraries handle

Decoding turns the data sent by a machine into values an application can use. Encoding does the reverse: it turns values or requests into FTMS data.

The libraries handle that translation. The application handles Bluetooth discovery and connections. It also owns decisions about safe control. That lets a project use the Bluetooth stack that fits its platform.

## Libraries for the language you use

Each implementation stands on its own. You do not need to install the other language versions. Shared examples and tests help them agree about the same data while fitting their own ecosystems.

- <a href="https://deancochran.github.io/ftms/start/typescript/" rel="external">TypeScript and JavaScript</a> are available as an npm package for web and Node projects.
- <a href="https://deancochran.github.io/ftms/start/c/" rel="external">C</a> is a portable C99 library that can also be used from C++.
- <a href="https://deancochran.github.io/ftms/start/swift/" rel="external">Swift</a> is available through SwiftPM for native Apple projects.
- <a href="https://deancochran.github.io/ftms/start/kotlin/" rel="external">Kotlin and Java</a> are available through Maven Central for Kotlin/JVM, Java, and Android work.
- <a href="https://deancochran.github.io/ftms/start/python/" rel="external">Python</a> is a published partial alpha. Its API is still evolving. It does not yet include helpers for interpreting what a machine supports.

## Documentation is part of the project

I've put time into the documentation as well as the code. Each language has a setup guide and examples. The <a href="https://deancochran.github.io/ftms/integration/cookbook/" rel="external">cookbook</a> helps choose APIs and includes task recipes. The <a href="https://deancochran.github.io/ftms/integration/transports/" rel="external">Bluetooth integration recipes</a> show how to use an existing stack.

The <a href="https://deancochran.github.io/ftms/integration/troubleshooting/" rel="external">troubleshooting guide</a> covers common questions after installation. I want the documentation to be useful while someone is building, not just when they first download a package.

Choose a language on the <a href="https://deancochran.github.io/ftms/" rel="external">FTMS documentation site</a> to get started. The [source project](https://github.com/deancochran/ftms) is open source under the MIT license.

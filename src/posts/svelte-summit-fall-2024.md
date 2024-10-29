---
title: Svelte 5.0 released at Svelte Fall 2024 Summit
slug: svelte-summit-fall-2024
date: "2024-10-18"
image: /images/svelte-summit-fall-2024.png
description: The Svelte Summit Fall 2024 Virtual Show was packed with exciting talks from various speakers, sharing their experiences and introducing the latest updates to the Svelte ecosystem. Here's a summary of some of the sessions that interested me the most.
published: true
---

## Contents

## Behavioural Testing with Cucumber.io and "Gerkin Syntax" - David Hunt

David Hunt showcased [Gerkin Syntax](https://cucumber.io/docs/gherkin/), a
behavioural testing syntax designed to simplify the testing process. Gerkin
allows developers to write tests in natural, readable English, which drastically
minimizes the need for extensive code. This approach ensures that tests are more
approachable for everyone on the team, even non-developers.

Key Takeaways:

- Minimal code is required to write tests.
- Tests are expressed in human-readable language, improving accessibility and
  understanding across teams.

## Demystifying Client & Server Rendering in SvelteKit - Henry Lie

Henry Lie took the stage to discuss the evolution of rendering strategies, from
MPAs (Multi-Page Apps) to SPAs (Single Page Applications), and introduced the
concept of **Transitional Apps**, where SvelteKit shines. He explored how
SvelteKit can combine static and dynamic content with hybrid rendering
techniques, and the ability to configure rendering strategies (SSR, CSR, or
static pages) on a per-route basis.

Key Points:

- **MPA + SSG**: Early approaches where user interactions were slower.
- **SPA**: Frameworks like Svelte, React, and Vue made building complex apps
  easier.
- **Transitional Apps**: A hybrid solution that balances static and dynamic
  content.
- Use the **static adapter** for fully static content and the **node adapter**
  for dynamic pages.

## Lessons Learned from Building a Mobile App with Tauri and SvelteKit - Thilo Maier

Thilo Maier shared insights from his experience building a mobile app using
[Tauri](https://v2.tauri.app/) and **SvelteKit**. He emphasized the importance
of managing application state, even when the app is disconnected from the
internet. The key lesson was ensuring that the state is prioritized in SvelteKit
to maintain seamless user experiences in offline conditions.

## Local First Svelte - Scott Tolinski

Co-host of the [Syntax Podcast](https://syntax.fm/), Scott Tolinski, delivered a
talk on the **Local First** approach. His talk revolved around the idea that
applications should work fast, offline, and provide full data ownership to
users.

Principles of Local First:

- **No spinners**: The app should feel fast and responsive.
- **Availability**: Make apps work on any device, regardless of network.
- **Network optional**: Users should not rely on a network connection to use the
  app.
- **Privacy and security**: Keep users' data private and secure, with all data
  being downloadable and owned by the user.

Scott's main message: Local-first data means speed, native feel, and reliability
across various network conditions.

Challenges:

- Pushing, polling, and syncing network data becomes more complex.
- SvelteKit developers may reduce their reliance on form actions.

## Big Announcements from Rich Harris

The moment many were waiting for: **Rich Harris** unveiled some exciting news
for the Svelte community. Svelte 5 was officially **released**! Along with it
comes a new unified website that combines **Svelte**, **SvelteKit**, and the
**Svelte tutorial** into one platform.

**Svelte Summit 2024** was a fantastic event, and it’s clear that the Svelte
community continues to innovate and push the boundaries of modern web
development. Whether you're excited about the new features in Svelte 5 or
inspired by the local-first approach, there's no doubt that the future of Svelte
is brighter than ever.

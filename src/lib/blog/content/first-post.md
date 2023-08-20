---
title: How I made this website
description: I often make projects with efficiency in mind. On rare occasions I find myself taking the more creative approach, shifting through options, and weighing out decisions. From my personal experience, I'll provide a note on what tools I used to program this website, the issues I had, and my solutions to end up with what you see now.

date: "2023-8-7"
categories:
  - sveltekit
  - svelte
  - typescript
  - aws
  - skeleton
  - s3
  - route53
  - cloudfront
published: true
img_url: "/profile_headshot.jpeg"
---

<!-- markdownlint-disable MD033 -->
<script>
  import Counter from "../../components/blog/Counter.svelte"
</script>

<!-- markdownlint-disable MD025 -->

# How I programmed this website

Developing your own personal website is a good way to show off your skills to a peer, employer, and client. As for myself, it displays my ability to utilize a plethora of modern tools, to create what could require whole team of people could build, in order for one person to build a performant website.

## Tools I used

Just to name off some languages, frameworks, and libraries used for this project.

- Typescript: Used to help me build the functions, logic, routes, and to fetch data displayed on evey page
- html - Honestly writing html can get boring and svelte makes it easy on me
- svelte: This `(Sveltekit)` was my frontend framework of choice. It is easier to read, experiment, and dare I say feels more performant!
- markdown: I wrote this blog you are ready now. In markdown... It's so easy to write, and makes blogging easy
- tailwind: this styled my entire website
- Skeleton UI: this was my UI library, is integrated with Tailwind and Svelte

## Services I used

I'll list out the services I used as well here.

- AWS: To help deployment, management and scaling
- GitHub: For versioning and CI/CD
- Docker: assists with local development and speeds deployment time

# How can you also use this technology stack to build awesome websites

Coming from someone who has an extremely short attention span. Watch this [Build A SvelteKit Markdown Blog](https://joyofcode.xyz/sveltekit-markdown-blog)

To start a website from scratch you'll need a bit of experience with a few things. The hardest in my opinion would be networking and CI/CD orchestration (Continuous Integration/Continuous Deployment). These however are only necessary if you plan on distributing the website publicly to the world under some domain name like [deancochran](https://deancochran.net).

For the sake of just building a project like this locally. You only need to know how to run basic [npm](https://www.npmjs.com/) commands, code in [typescript](https://www.typescriptlang.org/), and [sveltekit](https://kit.svelte.dev/).

`Assuming you have your IDE ready let's get started`

## Getting started

For styling and user interface design, I gave myself a helping hand and opted to use a well documented library, `Skeleton`. You can find most, if not all of of these steps in the [skeleton](https://www.skeleton.dev/docs/get-started) 'get started' page. **I advise reading through this before configuring your app**

```bash
mkdir ~/dev
cd ~/dev
npm create skeleton-app@latest your-app-name
cd your-app-name
npm i @skeletonlabs/skeleton --save-dev
```

_"Skeleton themes integrate with Tailwind and support color opacity, dark mode, and our powerful design tokens system."_

My favorite part about `Skeleton` is that they help me stay focused on creating content. Having a extendable library without compromises gives me the confidence keep moving forward. They even have multiple themes to chose from.

### Project Structure

Just for reference. Your project structure is as follows. **Working with the Sveltekit documentation is probably where you should start if this doesn't look familiar.**

```txt
your-app-name/
├ src/
│ ├ lib/
│ │ ├ server/
│ │ │ └ [your server-only lib files]
│ │ └ [your lib files]
│ ├ params/
│ │ └ [your param matchers]
│ ├ routes/
│ │ └ [your routes]
│ ├ app.html
│ ├ error.html
│ ├ hooks.client.js
│ └ hooks.server.js
├ static/
│ └ [your static assets]
├ tests/
│ └ [your tests]
├ package.json
├ svelte.config.js
├ tsconfig.json
└ vite.config.js
```

## Working with Markdown

Before we begin making content. I recommend setting up your svelte preprocessor to work with .md files. The [mdsvex](https://mdsvex.pngwn.io/) library provides some documentation for integration with svelte.

```ts
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

import { mdsvex } from "mdsvex";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".md"],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

### What does this lets you do?

This allows you to treat markdown files differently. For example in markdown files you can import and display components directly with a .md file. `You can also specify metadata that can be used by your application`

```md
src/lib/blog/example.md/

---

title: "example title"
description: "example description."
date: "2023-4-14"

---

# Welcome to my blog

The metadata found above the title won't be rendered

## Counter

This renders a counter component inside your Markdown.

<Counter />

## Images

Media inside the /static folder is served from `/`. But won't display when using a markdown preview tool

```

You can also import a Markdown post as a svelte module and render it with `svelte:component`. More on `svelte:component` can be found [here](https://svelte.dev/docs/special-elements#svelte-component).

## Developing your Routing Behavior

Knowing how to work with typescript is essential for configuring the routing structure of you website. So making sure you redirect users to the proper location to view the content of your markdown files is working learning.

Writing a function to collect a posts content from a utilities file is pretty essential since you'll want to use the function in multiple locations throughout your website.

```ts
src / lib / utils / blog / posts.ts;

import { json } from "@sveltejs/kit";

export type Categories =
  | "sveltekit"
  | "svelte"
  | "typescript"
  | "aws"
  | "skeleton"
  | "s3"
  | "route53"
  | "cloudfront";

export type Post = {
  title: string;
  slug: string;
  description: string;
  date: string;
  categories: Categories[];
  published: boolean;
  img_url: string | undefined;
};

async function getBlogPaths() {
  const paths = import.meta.glob("/src/lib/blog/content/*.md", { eager: true });
  return paths;
}

export async function getBlogPosts() {
  let posts: Post[] = [];

  const paths = await getBlogPaths();
  for (const path in paths) {
    const file = paths[path];
    const slug = path.split("/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<Post, "slug">;
      const post = { ...metadata, slug } satisfies Post;
      post.published && posts.push(post);
    }
  }

  posts = posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  );

  return json(posts);
}
```

You could extend this file to by adding your own functions to get a specific blog post. Pass the filename or slug, and filter the available blog post paths, then return the object.

### Results of your hard work

Though your website maybe completely unstyled, skeleton has your back. Besides you can now load any blog post into your svelte +page.svelte files

```ts
src / routes / blog / +page.ts;

import { type Post, getBlogPosts } from "$lib/utils/blog/posts";

export async function load({ fetch }) {
  const response = await getBlogPosts();
  const posts: Post[] = await response.json();
  return { posts };
}
```

```ts
src/routes/blog/+page.svelte

<script lang="ts">
  export let data
</script>

<div>
  <ul class="posts">
    {#each data.posts as post}
      <li class="post">
          <a href=/blog/{post.slug} class="title">{post.title}</a>
          <p class="date">{formatDate(post.date)}</p>
          <p class="description">{post.description}</p>
      </li>
    {/each}
  </ul>
</div>
```

# Showing your markdown content

Now that you've successfully loaded your content one one single page, you can work on displaying it one at a time. This is where you can add a specific layout for your blog posts.

```ts
src / routes / blog / [slug] / +page.ts;

import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const post = await import(`../../posts/${params.slug}.md`);

    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
```

This piece allows you to load the blogs content into the +page.svelte file

```ts
src/routes/blog/[slug]/+page.svelte

<script lang="ts">
  export let data
</script>


<div>
  <!-- Access your meta data -->
  <h1>{data.meta.title}</h1>
  <!-- Post -->
  <div class="prose">
    <svelte:component this={data.content} />
  </div>
</div>

<!-- Add your own styling here -->
```

# Closing thoughts

Now that you've either A made your own website locally or B made it to this section of the post. Thank You! Programming can be overwhelming and complex. So I decided to just to share the most important parts in my opinion.

This blog was inspired by [joy of code](https://joyofcode.xyz/sveltekit-markdown-blog)'s blog post, the [rodney lab](https://rodneylab.com/) site, as well as other related works.

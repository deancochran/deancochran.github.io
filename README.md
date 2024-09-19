# Dean's List

My opionated blog

This blog is written in svelte, utilizing sveltekit for routing, and obsidian for creating cotent.

## Managing Content

As mentioned obsidan is directly mounted to the root of the project. When creating content, I work directly in the `/src/posts directory`, refrencing any static content in the `/static` directory.

Obsidian allows me to utilize a vault sync for creating content remotely. However I will refrain from this initially.... More on this to come. I would like for the wesite to be updated anytime I add a new post, but that has numerous complications...

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

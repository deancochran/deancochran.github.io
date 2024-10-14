---
title: Building my Blog with Sveltekit and Terraform
slug: building-my-blog
date: '2024-9-17'
image: /images/logo.png
description: Most of the websites that I would use for my personal blog don't support custom code snippets, components, and other pieces of content I love. Clearly building a full blog is overkill, and not necessary for the average 'blogger'. I'm coming at this from a 'because I can' attitude here. Not everyone needs these solutions, but here is mine for those interested in my implementation.
published: true;
---

## Contents

## About my blog

I decided to build a blog using tools and frameworks I’m most comfortable with.
While not all of these are essential, they represent a stack that suits my
workflow:

- **SvelteKit**: A UI framework that uses a compiler to help build concise,
  fast-loading components.
- **Obsidian**: A private and flexible writing app that I use as my markdown
  editor.
- **Buttondown**: An email platform that makes it easy to start and grow a
  newsletter.
- **Terraform**: A tool for automating infrastructure, which I use to deploy and
  distribute my blog.

As a foreword, this post is not a deep dive into the technical details of my
blog’s setup. Instead, I’m outlining the project as a reference for myself and
anyone interested in building a similar system. I’d like to thank the following
for their valuable resources:

The maintainers of:

- [Skeleton UI](https://www.skeleton.dev/)
- [Mdsvex](https://mdsvex.pngwn.io/)

And the blogs of:

- [Joy of Code](https://joyofcode.xyz/)
- [Josh Collinsworth](https://joshcollinsworth.com/)
- [John Miller](https://john-miller.dev/)
- [Wiktor Kowalski](https://blog.wiktorkowalski.pl/)

## Configure Sveltekit

To set up a static blog capable of rendering markdown files, I configured
SvelteKit to use a static site generator (SSG).

Start by installing the SvelteKit static adapter:

```sh
npm i -D @sveltejs/adapter-static
```

Then, add the adapter to your svelte.config.js file:

```ts
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ....
	// your config
	// ....

	kit: {
		adapter: adapter({
			pages: 'dist',
			fallback: 'index.html'
		}),
		prerender: {
			crawl: true
		}
	}
	}
};

export default config;
```

Ensuring that all your files can be prerendered is crucial. Having dynamic
content transformed into cachable static assets is a huge performance boost for
the site.

### Page Routing and Rendering

The root of the project is in the `routes/` directory. Within that, I created a
folder called `[...path]/` to handle routing logic for the blog. This folder
contains two main files:

- `+page.ts`: Loads and processes the posts.
- `+page.svelte`: Displays the post.

I write my posts in markdown for faster content creation while focusing on the
writing itself. SvelteKit, with the help of mdsvex, handles the transformation
of markdown into renderable Svelte components.

### Mdsvex

[mdsvex](https://mdsvex.pngwn.io/docs) is a popular Svelte package that allows
you to write markdown in your Svelte components or Svelte syntax in your
markdown files.

To configure mdsvex in your project, first install it:

```sh
npm i --save-dev mdsvex
```

Then, update your svelte.config.ts file:

```ts
// svelte.config.ts
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  // define you're config inside here
};
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],
  // other config stuff...
};

export default config;
```

I’ve kept the mdsvex configuration simple, but if you want more details, feel
free to check out my full setup
[here](https://github.com/deancochran/deancochran/blob/main/svelte.config.js).

#### Svelte and Markdown

SvelteKit doesn’t natively render markdown without configuring a markdown
processor like mdsvex. This setup allows `.md` files to be parsed into usable
HTML strings and rendered inside Svelte components.

Here’s a simple example of how you can dynamically load and display markdown
content in your SvelteKit app:

```jsx
// [...posts]/+page.svelte
<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:component this={data.component} />
```

### Skeleton UI

[Skeleton](https://www.skeleton.dev/) integrates with Tailwind to provide
opinionated solutions for themes, colors, typography and more. Including easy to
use components for your favorite web frameworks.

I use skeleton's unreleased v3 updates which are almost complete! Go support
them, and checkout their nearly complete
[v3 documentation](https://next.skeleton.dev/) (link is likely to expire when
the updates are finished) to get started.

## Terraform and Infrastructure as Code

For deployment, I rely on Terraform to automate the infrastructure setup for my
blog. Here’s a breakdown of the components I use:

- **S3 Buckets**: I deploy two S3 buckets—one for storing the Terraform remote
  backend and another for hosting my blog’s static content. The S3 bucket
  efficiently serves my static assets (HTML, CSS, JavaScript).

- **CloudFront Distribution**: I use Amazon CloudFront as a CDN for my blog,
  ensuring fast, secure delivery of content to users worldwide. It’s placed in
  front of my S3 bucket to speed up access times.

- **Route 53 Domain Name**: Amazon Route 53 manages my DNS and domain name,
  allowing me to point my custom domain to the CloudFront distribution and
  handle HTTPS traffic seamlessly.

- **Additional Infrastructure**: Terraform helps automate the provisioning of
  SSL certificates (via AWS Certificate Manager), configure IAM roles, and scale
  resources as needed.

## Obsidian

I use Obsidian as my primary writing tool. It’s a powerful, flexible markdown
editor that lets me focus solely on writing, without distractions from
formatting or code. Obsidian allows me to easily organize my drafts, manage
notes, and sync my posts with my SvelteKit blog setup.

Once my posts are finalized in markdown, I export the files, and mdsvex takes
care of converting them into HTML for the blog. It’s a straightforward and
efficient workflow that helps me focus on creating content.

## Deploying and Updating the app

Here's how you can implement the deployment and updating process using a
combination of the services I've mentioned

### 1. Update Git Repository

Push your latest changes to your Git repository using standard Git commands:

```bash
# Add any new or updated files
git add .

# Commit the changes with a message
git commit -m "Update blog content and infrastructure"

# Push the changes to your remote repository
git push origin main
```

### 2. Sync S3 Bucket with Static Files

To sync your static blog content to your S3 bucket, you can use the AWS CLI
command. Replace `my-s3-bucket` with your actual S3 bucket name:

```bash
# create a new production build with you're latest changes
npm run build
# Sync the local build directory (e.g., dist/) with your S3 bucket
aws s3 sync ./dist s3://my-s3-bucket --delete
```

This command ensures that the latest static files are uploaded to your S3
bucket, and any deleted or changed files are updated accordingly.

### 3. Invalidate CloudFront Cache

To ensure that CloudFront serves the updated content, you need to invalidate its
cache. This forces CloudFront to fetch the new files from the S3 bucket. Replace
`your-distribution-id` with your CloudFront distribution ID:

```bash
# Invalidate CloudFront cache to serve the latest content
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

This command will invalidate all the cached files so that the updated files are
served immediately.

### 4. Infrastructure Changes with Terraform

If any infrastructure changes are necessary, you can apply them with Terraform.
Here’s how to initialize Terraform and apply changes to your infrastructure:

```bash
# Navigate to your Terraform configuration directory
cd terraform

# Initialize Terraform (only required the first time or after changes to modules/providers)
terraform init

# Review the planned changes
terraform plan

# Apply the changes to your infrastructure
terraform apply
```

With these steps, you can easily deploy and update your blog, ensuring that new
content and infrastructure changes are live without manual intervention. By
automating the workflow, you’re able to focus on writing and growing your blog,
while the deployment pipeline handles the rest.

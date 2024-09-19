---
title: Building my Blog with Svelte, Obsidian, and Terraform
slug: building-my-blog
date: '2024-9-17'
image: /images/logo.png
description: Most of the websites that I would use for my personal blog don't support custom code snippets, components, and other peices of content I love. Clearly building a full blog is overkill, and not necessary for the average 'blogger'. I'm coming at this from a 'becuase I can' attitude here. Not everyone needs these solutions, but here is mine for those interested in my implementation.
published: true;
---

## Contents

I decided to build a blog with the resources, and frameworks I feel most comfortable with. Utilizing all these are not inherently necessary.

- **Sveltekit**: UI framework that uses a compiler to let you concise components
- **Obsidan**: A private and flexible writing app that I use as a markdown editor
- **Terraform**: An automation for infrastructure tool that I use to deploy and distribute my blog

In this guide I hope to outline the 'ins and outs' of my blog. Through instruction and general outlining of this project. I plan for it to serve as a reference, not only for myself as a build it, but for anyone interested in taking matters into their own hands like myself.

## Configure Sveltekit

For a static blog that is capable of rendering markdown files. You'll need to configure sveltekit to use a a static site generator (SSG).

Install that sveltekit static adapter `npm i -D @sveltejs/adapter-static` , then add the adapter to your `svelte.config.js`: See more here: <https://kit.svelte.dev/docs/adapter-static>

```ts
// ...
// your imports
// ...
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// ....
	// your config
	// ....

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
```

### Routing Debrief

Ideally if recreating this implementation, you would use something similar. I use some advance routing techniques to parse through my markdown notes and render them to the page.

The root of the project is found at `routes/` inside the directory I configured a handful of things here. Notably I have a folder `[...path]/` where I store most of the routing logic for my blog.
The folder contains a `+page.ts`, to find and load the post, then `+page.svelte` displays the loaded post.

#### In Depth with Markdown Editors and Markdown preprocessors

As noted I use a mardown editor to take notes. It allows me to _just write_ without worry of the actual end user interface. Notably svelte does **not** render markdown files without additional configuration.
This additional configuration needed. Takes files in markdown format `.md` and parses them into a readable `html` string.

A markdown preprocessor turns:

```md
<!-- post.md -->

# Title

## Subtitle

This is a description of a post
```

into:

```xml
<!-- post.html -->
<h1>Title</h1>
<h2>Subtitle</h2>
<p>This is a description of a post</p>
```

Svelte enables you to create logic to dyanmically import markdown posts inside your source code, process the markdown into html strings, then pass these html strings into native svelte components and render them into a web page as such.

```ts
export const load: PageLoad = async (event) => {
	// where I mount my markdown editor
	const modules = import.meta.glob('/src/posts/**/*.md');
	// finding the post that has matching metadata
	let match: { path?: string; resolver: MdsvexResolver } | undefined;
	for (const [path, resolver] of Object.entries(modules)) {
		// the relativePath is used for <a> tags
		// Example:...
		// instead of /src/posts/BlogFolder/SubFolder/post-name.md
		// it returns BlogFolder/SubFolder/post-name.md
		const relativePath = path.split('.')[0].split('/').slice(3).join('/');
		if (relativePath === event.params.path) {
			match = { path, resolver: resolver as unknown as MdsvexResolver };
			break;
		}
	}
	// throws error incase no match was found
	if (!match) {
		throw error(404); // Couldn't resolve the post
	}

	const post = await match.resolver();
	// throws error incase the match's content/metadata couldn't be resolved
	if (!post || !post.metadata.published || !post.default) {
		throw error(404); // Couldn't resolve the post
	}

	return {
		component: post.default,
		meta: post.metadata
	};
};
```

Then when rendering the html string in the form of a svelte component you can load the file as such.

```jsx
[...posts]/+page.svelte
<script lang="ts">
 import type { PageData } from './$types';
 export let data: PageData;
</script>


<svelte:component this={data.component} />
```

## Mdsvex

[mdsvex](https://mdsvex.pngwn.io/docs) is a popular svelte packageto use when dealing with markdown files in your svelte project. This packaged markdown preprocessor allows you to use Svelte components in your markdown, or vice versa with markdown in your Svelte components.

Configuring the package isn't exhausting at all. Notably a small adjust needs to be made to the `svelte.config.ts` file.

First install the package `npm i --save-dev mdsvex`

```ts
// svelte.config.ts

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
```

Terraform is a tool that allows you to automate the process of building, changing, and versioning infrastructure. It provides a unified command line and configuration language (called **HCL**, or HashiCorp Configuration Language) to manage resources across multiple providers, such as AWS, Azure, Google Cloud, or even on-premise infrastructure.

With Terraform, instead of manually configuring your cloud infrastructure, you write declarative configuration files that describe **what** your infrastructure should look like. Terraform will handle the rest—creating, updating, and deleting resources as needed to match the configuration.

### Key Benefits of Terraform

1. **Multi-Cloud Support**: One of Terraform’s greatest strengths is its ability to work with multiple cloud providers. You can manage your entire infrastructure from one place, whether you’re using AWS, Azure, or even SaaS products like GitHub.

2. **Declarative Language**: Instead of writing imperative commands to create infrastructure, Terraform lets you describe the desired state of your resources. For example, you define what you want (like an EC2 instance or S3 bucket), and Terraform takes care of the how.

3. **State Management**: Terraform keeps track of your infrastructure's state via a **state file**. This file is crucial for understanding the difference between your infrastructure as it exists and the desired state described in your configuration files.

4. **Version Control**: Because your infrastructure is defined in code, you can track and version it just like you would with application code. This allows you to roll back changes if necessary, peer review configurations, and collaborate with others easily.

## Key Concepts in Terraform

### Providers

Terraform uses **providers** to interact with APIs and services like AWS, Google Cloud, Azure, and more. Each provider has its own set of resources and data sources that can be managed. To start using a provider, you simply define it in your configuration.

In this example, we define the AWS provider and specify the region where our resources will be deployed.

### Resources

Resources are the key building blocks in Terraform. These are the services or infrastructure components you want to create, modify, or delete. For example, an AWS EC2 instance, an S3 bucket, or a Google Cloud SQL instance are resources.

```js
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

Here, we are defining an EC2 instance using the `aws_instance` resource. The `"example"` is just a logical name to reference this instance later in the configuration.

### State

Terraform maintains the state of your infrastructure using a **state file**. This file stores information about what Terraform manages, which helps it know what changes need to be made to bring your infrastructure up to the desired state. Managing the state properly is crucial for keeping infrastructure consistent, and the state can be stored locally or remotely.

### Modules

Modules are containers for multiple resources that are used together. They enable you to organize and reuse configurations. For example, if you frequently deploy similar configurations for different environments, like staging and production, modules allow you to define these once and reuse them across environments.

```js
module "vpc" {
  source = "./modules/aws_vpc"
  cidr_block = "10.0.0.0/16"
}
```

### Plan and Apply

Terraform’s workflow involves two key commands:

- **terraform plan**: This command shows you what Terraform will do to your infrastructure based on the configuration files. It allows you to verify the changes before making them.

- **terraform apply**: After reviewing the plan, you can run this command to apply the changes, and Terraform will execute the plan to reach the desired state.

## Getting Started with Terraform

If you're new to Terraform, here’s a step-by-step guide to help you get up and running quickly.

### Step 1: Install Terraform

Terraform is easy to install. You can download it from the [official Terraform website](https://www.terraform.io/downloads) or install it using a package manager.

- **For macOS (using Homebrew)**:

```sh
brew install terraform

```

- **For Windows (using Chocolatey)**:

```sh
choco install terraform
```

### Step 2: Set Up a Provider

In this example, we’ll use AWS. First, configure AWS as your provider by specifying the region in your `main.tf` file:

```js
provider "aws" {
  region = "us-west-2"
}
```

Make sure you have AWS credentials configured by running `aws configure` or setting up your credentials manually.

### Step 3: Define Resources

Next, define the resources you want to create. For instance, to create an EC2 instance:

```js
resource "aws_instance" "my_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

### Step 4: Plan and Apply

After defining your resources, run the `terraform plan` command to preview the changes Terraform will make to your infrastructure:

```sh
terraform plan
```

If everything looks good, apply the changes:

```sh
terraform apply
```

Terraform will provision the resources as defined in your configuration.

### Step 5: Managing Infrastructure

Once you have applied the configuration, Terraform will continue to track your infrastructure’s state. Any future changes to the `main.tf` file can be planned and applied just like the initial deployment. Terraform will update the infrastructure in place, adding new resources, deleting obsolete ones, and modifying existing resources as needed.

## Best Practices for Using Terraform

1. **Use Remote State Storage**: Store your state file in a remote backend, like AWS S3 or Terraform Cloud, to collaborate across teams and avoid conflicts.

2. **Use Modules**: Modularize your configuration for easier maintenance and reusability.

3. **Version Control Your Infrastructure**: Store your configuration files in Git or another version control system to track changes, review code, and ensure infrastructure consistency.

4. **Automate with CI/CD**: Use Terraform as part of your CI/CD pipeline to automate infrastructure changes in response to updates in your codebase.

## Conclusion

Terraform is an incredibly powerful tool for managing cloud infrastructure at scale. It simplifies the process of provisioning resources, ensures consistency, and allows you to manage multi-cloud environments effortlessly. Whether you're new to cloud infrastructure or a seasoned DevOps engineer, Terraform will help you automate your infrastructure and improve your deployment workflows.

If you haven’t tried Terraform yet, now is the perfect time to dive in. By following the steps in this guide, you can start building and managing infrastructure like a pro!

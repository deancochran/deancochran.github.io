import { transformerCopyButton } from '@rehype-pretty/transformers'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'
import remarkUnwrapImages from 'remark-unwrap-images'
import { codeToHtml } from 'shiki'

const theme = 'github-dark'
async function customHighlight(code, lang) {
	return await codeToHtml(code, {
		lang,
		transformers: [
			transformerCopyButton({
				visibility: 'always',
				feedbackDuration: 3_000,
				copyIcon: '/icons/copy.svg',
			}),
		],
		theme,
	})
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/mdsvex.svelte',
	},

	highlight: {
		highlighter: async (code, lang = 'text') => {
			let html = await customHighlight(code, lang)
			return `{@html \`${html}\` }`
		},
	},
	remarkPlugins: [
		remarkMath,
		// katexBlocks,
		remarkUnwrapImages,
		[remarkToc, { tight: true, maxDepth: 3 }],
	],
	rehypePlugins: [
		// correctHastTree,
		rehypeKatexSvelte,
		rehypeSlug,
		rehypeAutolinkHeadings,
	],
}

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
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			strict: true,
			fallback: null, // 'index.html',
		}),
		prerender: {
			crawl: true,
		},
	},
}

export default config

import { transformerCopyButton } from '@rehype-pretty/transformers';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import katex from 'katex';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// import rehypeKatex from 'rehype-katex';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import remarkUnwrapImages from 'remark-unwrap-images';
import { codeToHtml } from 'shiki';
import { visit } from 'unist-util-visit';

const correctHastTree = () => (tree) => {
	visit(tree, 'text', (node) => {
		if (node.value.trim().startsWith('<')) {
			node.type = 'raw';
		}
	});
};

const katexBlocks = () => (tree) => {
	visit(tree, 'code', (node) => {
		if (node.lang === 'math') {
			const str = katex.renderToString(node.value, {
				displayMode: true,
				leqno: false,
				fleqn: false,
				throwOnError: true,
				errorColor: '#cc0000',
				strict: 'warn',
				output: 'htmlAndMathml',
				trust: false,
				macros: { '\\f': '#1f(#2)' }
			});

			node.type = 'raw';
			node.value = '{@html `' + str + '`}';
		}
	});
};

const theme = 'github-dark';
async function customHighlight(code, lang) {
	return await codeToHtml(code, {
		lang,
		transformers: [
			transformerCopyButton({
				visibility: 'always',
				feedbackDuration: 3_000,
				copyIcon: '/icons/copy.svg'
			})
		],
		theme
	});
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/mdsvex.svelte'
	},

	highlight: {
		highlighter: async (code, lang = 'text') => {
			let html = await customHighlight(code, lang);
			return `{@html \`${html}\` }`;
		}
	},
	remarkPlugins: [
		remarkMath,
		katexBlocks,
		remarkUnwrapImages,
		[remarkToc, { tight: true, maxDepth: 3 }]
	],
	rehypePlugins: [correctHastTree, rehypeKatexSvelte, rehypeSlug, rehypeAutolinkHeadings]
};

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
			fallback: null // 'index.html'
		}),
		prerender: {
			crawl: true
		}
	}
};

export default config;

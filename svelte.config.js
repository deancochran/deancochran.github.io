import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { escapeSvelte, mdsvex } from 'mdsvex'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import rehypeSlug from 'rehype-slug'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'
import remarkUnwrapImages from 'remark-unwrap-images'

import { createHighlighter } from 'shiki'
const highlighter = await createHighlighter({
    themes: ['poimandres'],
    langs: [
        'javascript',
        'typescript',
        'bash',
        'python',
        'svelte',
        'sh',
        'xml',
        'jsx',
    ],
})
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],

    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(
                highlighter.codeToHtml(code, { lang, theme: 'poimandres', })
            )
            return `{@html \`${html}\` }`
        },
    },
    remarkPlugins: [
        remarkMath,
        remarkUnwrapImages,
        [remarkToc, { tight: true, maxDepth: 3 }],
    ],
    rehypePlugins: [rehypeKatexSvelte, rehypeSlug, rehypeAutolinkHeadings],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
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

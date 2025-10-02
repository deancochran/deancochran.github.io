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
                highlighter.codeToHtml(code, { lang, theme: 'poimandres' })
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

const dev = process.argv.includes('dev')

// Use environment variable for base path
// Default '' for local dev, '/deancochran' for GitHub Pages
const basePath = dev ? '' : process.env.PUBLIC_BASE_PATH || '/deancochran'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'],
    preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            strict: true,
            fallback: undefined,
            precompress: false,
        }),
        prerender: {
            crawl: true,
            entries: [
                '*',
                '/rss.xml',   // include static base-aware files
                '/robots.txt'
            ]
        },
        paths: {
            base: basePath
        }
    },
}

export default config


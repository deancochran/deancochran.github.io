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
import { SITE_ORIGIN } from './site.config.js'

const highlighter = await createHighlighter({
    themes: ['min-light', 'poimandres'],
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

const mdsvexOptions = {
    extensions: ['.md'],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(
                highlighter.codeToHtml(code, {
                    lang,
                    themes: {
                        light: 'min-light',
                        dark: 'poimandres',
                    },
                })
            )
            return `{@html \`${html}\`}`
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
    extensions: ['.svelte', '.md'],
    preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            precompress: false,
        }),
        prerender: {
            crawl: true,
            entries: ['*', '/rss.xml', '/sitemap.xml', '/robots.txt'],
            origin: SITE_ORIGIN,
        },
    },
}

export default config

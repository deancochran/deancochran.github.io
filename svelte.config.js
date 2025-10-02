import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import remarkUnwrapImages from 'remark-unwrap-images';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
    themes: ['poimandres'],
    langs: ['javascript', 'typescript', 'bash', 'python', 'svelte', 'sh', 'xml', 'jsx'],
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }));
            return `{@html \`${html}\` }`;
        },
    },
    remarkPlugins: [remarkMath, remarkUnwrapImages, [remarkToc, { tight: true, maxDepth: 3 }]],
    rehypePlugins: [rehypeKatexSvelte, rehypeSlug, rehypeAutolinkHeadings],
};

// Use environment variable for base path; fallback to empty string
const basePath = process.env.PUBLIC_BASE_PATH ?? '';

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
            // Use the basePath variable for all entries
            entries: ['*', `${basePath}/rss.xml`, `${basePath}/robots.txt`] // only need actual routes; static folder is automatic
        },
        paths: {
            base: basePath,
        },
    },
};

export default config;


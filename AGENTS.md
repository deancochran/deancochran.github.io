# Repository Guide

## Toolchain and verification

- Use Node 24 and pnpm 11.3.0, pinned in `package.json`; `pnpm-lock.yaml` is the only committed lockfile.
- Run `pnpm check` for Svelte/TypeScript diagnostics, then `pnpm build` to verify prerendering and the service worker. There is no test or lint suite.
- Use `pnpm exec prettier --check .` for a non-mutating format check. `pnpm format` rewrites the entire repository with 4-space indentation, no semicolons, and single quotes.
- `pnpm dev` runs Vite on all interfaces and enables local HTTPS through `vite-plugin-mkcert`; first use may install a local CA.

## Static site flow

- This is one SvelteKit package using `adapter-static`. `pnpm build` prerenders the site into `build/`, including `/api/posts`, `/rss.xml`, and `/sitemap.xml`; runtime server behavior is unavailable after deployment.
- Markdown under `src/posts/**/*.md` is discovered with `import.meta.glob`. Its path relative to `src/posts/`, without `.md`, becomes `/blog/<path>`.
- Post frontmatter must provide `title`, `description`, `date`, and boolean `published`; `image` is optional in the type but expected by the post page's social metadata and header. Only `published: true` posts load publicly or appear in listings/RSS.
- Posts are mdsvex/Svelte components, not plain Markdown: they may import and render components. Syntax highlighting only supports the languages listed in `svelte.config.js`; add a Shiki language there before using a new fenced-code language.
- `src/lib/utils/getPosts.ts` feeds the prerendered posts API and RSS; post route loading is separately implemented in `src/routes/blog/[...path]/+page.ts`. Keep both discovery/path calculations aligned.
- `src/service-worker/index.ts` precaches only shell pages, generated CSS, favicons, and the logo. Visited pages and same-origin immutable assets/images are runtime-cached with entry limits; keep large media out of the install-time list.

## Deployment boundaries

- Pushes to `main` deploy `build/` to GitHub Pages via `.github/workflows/deploy.yml` after diagnostics and formatting checks.
- `infra/modules/static-blog/` is only a reusable AWS S3/CloudFront/Route53 Terraform module. Its root configuration is gitignored, and it is not used by the active GitHub Pages deployment.
- Scheduled workflows rewrite the WakaTime and latest-post marker sections in `README.md`; preserve those markers and avoid treating their generated contents as hand-maintained documentation.

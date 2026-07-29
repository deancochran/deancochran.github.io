/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope
import { build, files, prerendered, version } from '$service-worker'

const CACHE_PREFIX = 'deans-list-'
const PRECACHE = `${CACHE_PREFIX}precache-${version}`
const PAGE_CACHE = `${CACHE_PREFIX}pages-${version}`
const ASSET_CACHE = `${CACHE_PREFIX}assets-${version}`
const SHELL_ROUTES = new Set(['/', '/about', '/blog'])

const PRECACHE_ASSETS = [
    ...build.filter((path) => path.endsWith('.css')),
    ...files.filter(
        (path) => path.startsWith('/favicon/') || path === '/images/logo.webp'
    ),
    ...prerendered.filter((path) => SHELL_ROUTES.has(path)),
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter(
                            (key) =>
                                (key.startsWith(CACHE_PREFIX) ||
                                    key.startsWith('cache-')) &&
                                ![PRECACHE, PAGE_CACHE, ASSET_CACHE].includes(
                                    key
                                )
                        )
                        .map((key) => caches.delete(key))
                )
            )
    )
})

async function putWithLimit(
    cacheName: string,
    request: Request | string,
    response: Response,
    limit: number
) {
    const cache = await caches.open(cacheName)
    await cache.put(request, response)

    const keys = await cache.keys()
    await Promise.all(keys.slice(0, -limit).map((key) => cache.delete(key)))
}

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
        return
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                const cacheKey = url.pathname
                try {
                    const response = await fetch(event.request)
                    if (response.ok) {
                        event.waitUntil(
                            putWithLimit(
                                PAGE_CACHE,
                                cacheKey,
                                response.clone(),
                                20
                            )
                        )
                    }
                    return response
                } catch {
                    const cached = await caches.match(cacheKey)
                    return (
                        cached ??
                        (await caches.match('/')) ??
                        new Response('This page is unavailable offline.', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' },
                        })
                    )
                }
            })()
        )
        return
    }

    const shouldCacheAsset =
        url.pathname.startsWith('/_app/immutable/') ||
        event.request.destination === 'image'

    if (shouldCacheAsset) {
        event.respondWith(
            (async () => {
                const cached = await caches.match(event.request)
                if (cached) return cached

                const response = await fetch(event.request)
                if (response.ok) {
                    event.waitUntil(
                        putWithLimit(
                            ASSET_CACHE,
                            event.request,
                            response.clone(),
                            40
                        )
                    )
                }
                return response
            })()
        )
    }
})

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

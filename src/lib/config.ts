import { SITE_ORIGIN } from '../../site.config.js'

export { SITE_ORIGIN }

export function absoluteUrl(path: string) {
    return new URL(path, `${SITE_ORIGIN}/`).href
}

export const prerender = true
export const trailingSlash = 'never'
export const load = async (event) => {
    return {
        pathname: event.url.pathname,
    }
}

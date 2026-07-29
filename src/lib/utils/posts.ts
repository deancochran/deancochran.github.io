const POST_PREFIX = '/src/posts/'
const POST_SUFFIX = '.md'
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function requiredString(
    metadata: Record<string, unknown>,
    field: string,
    source: string
) {
    const value = metadata[field]
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`${source}: frontmatter '${field}' must be a string`)
    }
    return value
}

export function parsePostMetadata(metadata: unknown, source: string): BlogPost {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
        throw new Error(`${source}: frontmatter must be an object`)
    }

    const values = metadata as Record<string, unknown>
    const date = requiredString(values, 'date', source)
    const parsedDate = new Date(`${date}T00:00:00.000Z`)
    if (
        !ISO_DATE.test(date) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
    ) {
        throw new Error(
            `${source}: frontmatter 'date' must use a valid YYYY-MM-DD date`
        )
    }

    if (typeof values.published !== 'boolean') {
        throw new Error(`${source}: frontmatter 'published' must be a boolean`)
    }

    return {
        title: requiredString(values, 'title', source),
        description: requiredString(values, 'description', source),
        date,
        image: requiredString(values, 'image', source),
        published: values.published,
    }
}

export function getPostPath(source: string) {
    if (!source.startsWith(POST_PREFIX) || !source.endsWith(POST_SUFFIX)) {
        throw new Error(`Unexpected post source path: ${source}`)
    }

    return source.slice(POST_PREFIX.length, -POST_SUFFIX.length)
}

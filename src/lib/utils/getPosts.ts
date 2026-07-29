import { getPostPath, parsePostMetadata } from './posts'

export async function getPosts() {
    const allPostFiles = import.meta.glob('/src/posts/**/*.md')
    const iterablePostFiles = Object.entries(allPostFiles)

    return Promise.all(
        iterablePostFiles.map(async ([path, resolver]) => {
            try {
                const { metadata } = (await resolver()) as MdsvexFile
                return {
                    ...parsePostMetadata(metadata, path),
                    relativePath: getPostPath(path),
                }
            } catch (error) {
                throw new Error(`Failed to load post ${path}`, { cause: error })
            }
        })
    )
}

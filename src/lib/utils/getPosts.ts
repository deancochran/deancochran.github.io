export async function getPosts() {
	const allPostFiles = import.meta.glob('/src/posts/**/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = (await resolver()) as MdsvexFile;
			const route = path.split('.')[0].split('/').slice(3).join('/');
			return {
				...metadata,
				relativePath: route
			} as BlogPost & { relativePath: string };
		})
	);
	return allPosts;
}

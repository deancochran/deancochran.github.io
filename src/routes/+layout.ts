export const prerender = true;
export const load = async (event) => {
	return {
		pathname: event.url.pathname
	};
};

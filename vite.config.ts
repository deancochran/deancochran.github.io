import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	// https://github.com/liuweiGL/vite-plugin-mkcert/issues/89
	server: { proxy: {} },
	plugins: [enhancedImages(), sveltekit(), mkcert()]
});

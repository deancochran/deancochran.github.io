import { contentPath, skeleton } from '@skeletonlabs/skeleton/plugin'
import * as themes from '@skeletonlabs/skeleton/themes'
import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'

import * as CustomThemes from './themes'
export default {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],

	theme: {
		extend: {},
	},

	plugins: [
		forms,
		skeleton({
			themes: [
				themes.cerberus,
				CustomThemes.halloween,
			],
		}),
	],
} as Config

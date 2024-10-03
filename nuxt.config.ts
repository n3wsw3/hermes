// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@nuxthub/core',
		'nuxt-auth-utils',
		'nuxt-rate-limit',
		'@nuxtjs/i18n',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
		'shadcn-nuxt'
	],
	hub: {
		database: true
	},
	shadcn: {
		prefix: '',
		componentDir: './components/ui'
	},
	colorMode: {
		classSuffix: '',
		storage: 'localStorage' // or 'sessionStorage' or 'cookie'
	},
	i18n: {
		strategy: 'no_prefix',
		locales: [
			{
				code: 'en',
				name: 'English'
			},
			{
				code: 'sv',
				name: 'Svenska'
			}
		]
	}
});

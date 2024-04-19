// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['nuxt-auth-utils', '@nuxtjs/eslint-module'],
	runtimeConfig: {
		db: {
			dir: './server/database',
			migrations: './server/database/migrations',
			schema: './server/database/schema.ts',
			connection_string: 'postgres://piloten:piloten@localhost:5432/pr-piloten'
		}
	}
});

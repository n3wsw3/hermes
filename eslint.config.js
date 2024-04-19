// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu({
	extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
	ignores: ['.nuxt/**/*', 'node_modules/**/*', 'pnpm-lock.yaml', '.output/**/*'],
	rules: {
		'jsonc/indent': ['error', 'tab'],
		'style/no-tabs': 'off',
		'vue/html-indent': ['error', 'tab'],
		'style/indent': ['error', 'tab'],
		'antfu/top-level-function': 'off',
		'no-undef': 'off'
	}
});

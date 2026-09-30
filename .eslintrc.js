/**
 * ESLint config for this n8n community node.
 * Mirrors the official n8n-nodes-starter template: n8n's package review
 * (and `npm run lint`, wired into `prepublishOnly`) checks credentials
 * and nodes against eslint-plugin-n8n-nodes-base's rulesets.
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},
	ignorePatterns: ['.eslintrc.js', '**/*.js', 'dist/**', 'node_modules/**'],
	overrides: [
		{
			files: ['credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/credentials'],
		},
		{
			files: ['nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/nodes'],
		},
	],
};

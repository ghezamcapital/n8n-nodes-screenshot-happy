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
			rules: {
				// n8n's own official community-package scanner
				// (@n8n/scan-community-package, which runs the real
				// Creator Portal pre-check) explicitly turns these two
				// rules off in its scan config, because they predate the
				// NodeConnectionTypes enum convention and would otherwise
				// contradict it -- they still want the old string-literal
				// ['main'] form that NodeConnectionTypes.Main replaces.
				// Disabled locally too so `npm run lint` (prepublishOnly)
				// agrees with the actual verification target instead of
				// blocking a correct, modern node on an obsolete check.
				'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
				'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
			},
		},
	],
};

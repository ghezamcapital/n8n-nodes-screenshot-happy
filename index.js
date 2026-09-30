// This file exists only so `require('n8n-nodes-screenshot-happy')` doesn't
// error if something resolves the package root directly. n8n loads nodes
// and credentials from the paths declared in the "n8n" field of
// package.json (dist/credentials/..., dist/nodes/...), built by `npm run
// build` from the TypeScript sources in credentials/ and nodes/.
module.exports = {};

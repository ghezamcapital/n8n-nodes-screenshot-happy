const { src, dest } = require('gulp');

// n8n loads a node's icon from dist/nodes/<NodeDir>/<icon>.svg (the same
// relative path as the .ts source, per package.json's "icon": "file:...").
// tsc only compiles .ts, so the .svg has to be copied into dist separately
// -- this is that copy step, wired to package.json's "build" script
// ("tsc && gulp build:icons").
function buildIcons() {
	return src('nodes/**/*.{png,svg}').pipe(dest('dist/nodes'));
}

exports['build:icons'] = buildIcons;

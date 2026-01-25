/* ----------------------------------------------------------------------------
Read main.css, process with LightningCSS, and return for inlining
---------------------------------------------------------------------------- */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Features, bundleAsync } from 'lightningcss';

export default async function inlineCSS() {
	const cssPath = join(process.cwd(), '_source/assets/css/main.css');
	const cssContent = readFileSync(cssPath, 'utf8');
	
	const targets = { future: 1 }; // enables draft syntaxes
	const result = await bundleAsync({
		filename: cssPath,
		minify: true,
		drafts: { customMedia: true },
		targets,
	});
	
	return result.code.toString('utf8');
}

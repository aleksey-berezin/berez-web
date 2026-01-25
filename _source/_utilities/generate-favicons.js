/* ----------------------------------------------------------------------------
   Generate all favicon sizes from SVG source
   Creates all recommended favicon sizes for modern browsers and devices
   ---------------------------------------------------------------------------- */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

export default async function generateFavicons() {
	const svgPath = join(process.cwd(), '_source/assets/images/icons/favicon.svg');
	const outputDir = join(process.cwd(), '_source/assets/images/icons');
	
	if (!existsSync(svgPath)) {
		console.warn('favicon.svg not found, skipping favicon generation');
		return;
	}

	const svgBuffer = readFileSync(svgPath);

	// Essential favicon sizes
	const sizes = [
		{ size: 16, name: 'favicon-16x16.png' },
		{ size: 32, name: 'favicon-32x32.png' },
		{ size: 48, name: 'favicon-48x48.png' },
		{ size: 180, name: 'apple-touch-icon.png' }, // Apple standard (not 196)
		{ size: 192, name: 'android-chrome-192x192.png' },
		{ size: 512, name: 'android-chrome-512x512.png' },
	];

	// Generate all PNG sizes
	for (const { size, name } of sizes) {
		const outputPath = join(outputDir, name);
		await sharp(svgBuffer)
			.resize(size, size)
			.png()
			.toFile(outputPath);
		console.log(`Generated ${name}`);
	}

	// Generate favicon.ico (for legacy browsers)
	// Most modern browsers accept PNG as ICO, so we'll use the 32x32 PNG
	const icoPath = join(outputDir, 'favicon.ico');
	const favicon32 = readFileSync(join(outputDir, 'favicon-32x32.png'));
	writeFileSync(icoPath, favicon32);
	console.log('Generated favicon.ico');
}

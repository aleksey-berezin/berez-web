/* ----------------------------------------------------------------------------
   Generate all OG images at build time
   Run this during the Eleventy build process
   ---------------------------------------------------------------------------- */

import generateOGImage from './og-image.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const sections = JSON.parse(
	readFileSync(join(process.cwd(), '_source/_data/sections.json'), 'utf8')
);

export default async function generateAllOGImages() {
	const results = {};
	
	// Generate default OG image for homepage
	try {
		await generateOGImage('Portland Multifamily Investment', 'default');
		console.log('Generated default OG image');
	} catch (error) {
		console.error('Error generating default OG image:', error);
	}
	
	// Generate section-specific OG images
	for (const [sectionId, sectionData] of Object.entries(sections)) {
		try {
			const imagePath = await generateOGImage(sectionData.title, sectionId);
			results[sectionId] = imagePath;
			console.log(`Generated OG image for ${sectionId}: ${imagePath}`);
		} catch (error) {
			console.error(`Error generating OG image for ${sectionId}:`, error);
		}
	}
	
	return results;
}

/* ----------------------------------------------------------------------------
   Generate dynamic OG images with typography and brand colors
   Creates images at build time for each section
   ---------------------------------------------------------------------------- */

import { createCanvas, registerFont } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

// Brand colors
const COLORS = {
	bg: '#ffffff',
	accent: '#8b3a3a',
	text: '#1a1a1a',
	textMuted: '#666666',
};

// Font path (we'll use system fonts as fallback, but can load custom font)
const FONT_PATH = join(process.cwd(), '_source/assets/fonts/DMSans-Variable.woff2');

/**
 * Generate OG image for a section
 * @param {string} title - Section title
 * @param {string} sectionId - Section ID (for filename)
 * @returns {string} - Path to generated image
 */
export default async function generateOGImage(title, sectionId = 'default') {
	const width = 1200;
	const height = 630; // Standard OG image size
	const padding = 80;
	const maxTitleWidth = width - (padding * 2);

	// Create canvas
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Fill background
	ctx.fillStyle = COLORS.bg;
	ctx.fillRect(0, 0, width, height);

	// Try to load custom font, fallback to system font
	let fontLoaded = false;
	if (existsSync(FONT_PATH)) {
		try {
			registerFont(FONT_PATH, { family: 'DM Sans' });
			fontLoaded = true;
		} catch (error) {
			console.warn('Could not load custom font, using system font');
		}
	}

	// Draw accent bar on left
	ctx.fillStyle = COLORS.accent;
	ctx.fillRect(0, 0, 8, height);

	// Set up typography
	const fontFamily = fontLoaded ? 'DM Sans' : 'system-ui, -apple-system, sans-serif';
	
	// Draw company name (small, top)
	ctx.fillStyle = COLORS.textMuted;
	ctx.font = `400 24px ${fontFamily}`;
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.fillText('Berez Investment Group', padding, padding);

	// Draw section title (large, bold, main focus)
	ctx.fillStyle = COLORS.text;
	ctx.font = `800 72px ${fontFamily}`;
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';

	// Word wrap for long titles
	const words = title.split(' ');
	const lines = [];
	let currentLine = '';

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const metrics = ctx.measureText(testLine);
		
		if (metrics.width > maxTitleWidth && currentLine) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine = testLine;
		}
	}
	if (currentLine) {
		lines.push(currentLine);
	}

	// Draw title lines
	const lineHeight = 90;
	const titleStartY = 180;
	lines.forEach((line, index) => {
		ctx.fillText(line, padding, titleStartY + (index * lineHeight));
	});

	// Draw accent underline
	if (lines.length > 0) {
		const lastLineWidth = ctx.measureText(lines[lines.length - 1]).width;
		ctx.fillStyle = COLORS.accent;
		ctx.fillRect(padding, titleStartY + (lines.length * lineHeight) - 10, lastLineWidth, 4);
	}

	// Draw tagline at bottom
	ctx.fillStyle = COLORS.textMuted;
	ctx.font = `400 20px ${fontFamily}`;
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'left';
	ctx.fillText('Multifamily Investment | Portland Metro', padding, height - padding);

	// Convert canvas to buffer
	const buffer = canvas.toBuffer('image/png');

	// Optimize with sharp and save
	const outputDir = join(process.cwd(), '_site/assets/images/og');
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	const outputPath = join(outputDir, `og-${sectionId}.jpg`);
	
	await sharp(buffer)
		.jpeg({ quality: 90, mozjpeg: true })
		.resize(1200, 630)
		.toFile(outputPath);

	return `/assets/images/og/og-${sectionId}.jpg`;
}

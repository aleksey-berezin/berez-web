/* ----------------------------------------------------------------------------
   Dynamic OG Screenshot based on URL hash
   Updates Open Graph meta tags to use screenshot service with hash fragments
   ---------------------------------------------------------------------------- */

(function() {
	'use strict';

	/**
	 * Update OG tags with screenshot URL including hash
	 * The screenshot service uses Puppeteer which should handle hash fragments
	 * Using wait:2 to ensure page loads and hash navigation completes before screenshot
	 */
	function updateOGTags(hash = '') {
		const baseUrl = 'https://www.berez.in';
		const url = hash ? `${baseUrl}#${hash}` : baseUrl;
		
		// Include hash in screenshot URL - Puppeteer should handle it
		// The hash fragment (#) gets encoded as %23
		// Using wait:2 to wait for network connections to settle (ensures hash navigation completes)
		const screenshotUrl = `https://v1.screenshot.11ty.dev/${encodeURIComponent(url)}/opengraph/_wait:2/`;
		
		// Update og:image
		let ogImage = document.querySelector('meta[property="og:image"]');
		if (!ogImage) {
			ogImage = document.createElement('meta');
			ogImage.setAttribute('property', 'og:image');
			document.head.appendChild(ogImage);
		}
		ogImage.setAttribute('content', screenshotUrl);
		
		// Update twitter:image
		let twitterImage = document.querySelector('meta[name="twitter:image"]');
		if (!twitterImage) {
			twitterImage = document.createElement('meta');
			twitterImage.setAttribute('name', 'twitter:image');
			document.head.appendChild(twitterImage);
		}
		twitterImage.setAttribute('content', screenshotUrl);
		
		// Update og:url to include hash
		let ogUrl = document.querySelector('meta[property="og:url"]');
		if (ogUrl) {
			ogUrl.setAttribute('content', url);
		}
	}

	/**
	 * Get section from hash
	 */
	function getSectionFromHash() {
		const hash = window.location.hash;
		if (!hash) return '';
		
		// Remove # and return section ID
		return hash.substring(1);
	}

	/**
	 * Initialize
	 */
	function init() {
		// Update on page load
		const section = getSectionFromHash();
		if (section) {
			updateOGTags(`#${section}`);
		}
		
		// Update on hash change
		window.addEventListener('hashchange', () => {
			const section = getSectionFromHash();
			if (section) {
				updateOGTags(`#${section}`);
			} else {
				updateOGTags('');
			}
		});
	}

	// Run when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

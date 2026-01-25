/* ----------------------------------------------------------------------------
   Dynamic OG Image based on URL hash
   Updates Open Graph meta tags when user navigates to different sections
   ---------------------------------------------------------------------------- */

(function() {
	'use strict';

	// Map of section IDs to OG image paths and titles
	// OG images are generated dynamically at build time with typography
	const sectionOGMap = {
		'about': {
			image: '/assets/images/og/og-about.jpg',
			title: 'Our Mission | Berez Investment Group',
			description: 'Berez Investment Group strategically invests in multifamily communities throughout the Pacific Northwest.'
		},
		'strategy': {
			image: '/assets/images/og/og-strategy.jpg',
			title: 'Investment Strategy | Berez Investment Group',
			description: 'Our approach to identifying, acquiring, repositioning, and managing multifamily properties.'
		},
		'portland': {
			image: '/assets/images/og/og-portland.jpg',
			title: 'Why Portland | Berez Investment Group',
			description: 'Why the Portland metro area offers solid fundamentals for multifamily investors.'
		},
		'criteria': {
			image: '/assets/images/og/og-criteria.jpg',
			title: 'Acquisition Criteria | Berez Investment Group',
			description: 'What we look for in multifamily investment opportunities.'
		},
		'portfolio': {
			image: '/assets/images/og/og-portfolio.jpg',
			title: 'Current Portfolio | Berez Investment Group',
			description: 'Our current multifamily property portfolio in the Portland Metro area.'
		},
		'management': {
			image: '/assets/images/og/og-management.jpg',
			title: 'Property Management Philosophy | Berez Investment Group',
			description: 'How we approach property management for successful multifamily investing.'
		},
		'faq': {
			image: '/assets/images/og/og-faq.jpg',
			title: 'Frequently Asked Questions | Berez Investment Group',
			description: 'Common questions about our investment approach and property acquisitions.'
		},
		'contact': {
			image: '/assets/images/og/og-contact.jpg',
			title: 'Contact Us | Berez Investment Group',
			description: 'Get in touch about property submissions or investment inquiries.'
		}
	};

	// Get base URL from canonical link or construct it
	function getBaseUrl() {
		const canonical = document.querySelector('link[rel="canonical"]');
		if (canonical) {
			const url = new URL(canonical.href);
			return `${url.protocol}//${url.host}`;
		}
		return window.location.origin;
	}

	// Update OG meta tags
	function updateOGTags(sectionId) {
		const baseUrl = getBaseUrl();
		const section = sectionOGMap[sectionId];
		
		if (!section) {
			// Reset to default if section not found
			return;
		}

		// Update OG image
		const ogImage = document.querySelector('meta[property="og:image"]');
		if (ogImage) {
			ogImage.setAttribute('content', `${baseUrl}${section.image}`);
		}

		// Update OG title
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle) {
			ogTitle.setAttribute('content', section.title);
		}

		// Update OG description
		const ogDescription = document.querySelector('meta[property="og:description"]');
		if (ogDescription) {
			ogDescription.setAttribute('content', section.description);
		}

		// Update OG URL (include hash for sharing)
		const ogUrl = document.querySelector('meta[property="og:url"]');
		if (ogUrl) {
			ogUrl.setAttribute('content', `${baseUrl}${window.location.pathname}${window.location.hash}`);
		}

		// Update Twitter Card image
		const twitterImage = document.querySelector('meta[name="twitter:image"]');
		if (twitterImage) {
			twitterImage.setAttribute('content', `${baseUrl}${section.image}`);
		}

		// Update Twitter title
		const twitterTitle = document.querySelector('meta[name="twitter:title"]');
		if (twitterTitle) {
			twitterTitle.setAttribute('content', section.title);
		}

		// Update Twitter description
		const twitterDescription = document.querySelector('meta[name="twitter:description"]');
		if (twitterDescription) {
			twitterDescription.setAttribute('content', section.description);
		}

		// Update page title
		document.title = section.title;
	}

	// Get section ID from hash
	function getSectionFromHash() {
		const hash = window.location.hash;
		if (hash && hash.length > 1) {
			return hash.substring(1); // Remove the #
		}
		return null;
	}

	// Initialize on page load
	function init() {
		const sectionId = getSectionFromHash();
		if (sectionId && sectionOGMap[sectionId]) {
			updateOGTags(sectionId);
		}
	}

	// Update on hash change
	window.addEventListener('hashchange', () => {
		const sectionId = getSectionFromHash();
		if (sectionId && sectionOGMap[sectionId]) {
			updateOGTags(sectionId);
		}
	});

	// Initialize
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

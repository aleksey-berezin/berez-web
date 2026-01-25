/* ----------------------------------------------------------------------------
   Simple scroll-triggered animations using Intersection Observer
   Lightweight, no dependencies, respects prefers-reduced-motion
   ---------------------------------------------------------------------------- */

(function() {
	'use strict';

	// Respect user's motion preferences
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return; // Exit early if user prefers reduced motion
	}

	// Wait for DOM to be ready
	function init() {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.setAttribute('data-animated', 'true');
						observer.unobserve(entry.target);
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px',
			}
		);

		// Observe content sections
		document.querySelectorAll('.content-section').forEach((section) => {
			// Check if already in viewport
			const rect = section.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				section.setAttribute('data-animated', 'true');
			} else {
				observer.observe(section);
			}
		});

		// Observe stats
		const statsRow = document.querySelector('.stats-row');
		if (statsRow) {
			const statItems = statsRow.querySelectorAll('.stat-item');
			statItems.forEach((item, index) => {
				const rect = item.getBoundingClientRect();
				if (rect.top < window.innerHeight && rect.bottom > 0) {
					// Stagger animation for items already in view
					setTimeout(() => {
						item.setAttribute('data-animated', 'true');
					}, index * 100);
				} else {
					observer.observe(item);
				}
			});
		}
	}

	// Initialize
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

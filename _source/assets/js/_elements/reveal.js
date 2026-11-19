/* ----------------------------------------------------------------------------
Reveal on scroll
Adds `.is-visible` to [data-reveal] elements the first time they scroll into
view. Content stays visible without JS and for reduced-motion users.
---------------------------------------------------------------------------- */

const targets = document.querySelectorAll('[data-reveal]');
const reducedMotion = window.matchMedia(
	'(prefers-reduced-motion: reduce)',
).matches;

if (targets.length && 'IntersectionObserver' in window && !reducedMotion) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
	);

	for (const target of targets) {
		target.classList.add('reveal');
		observer.observe(target);
	}
}

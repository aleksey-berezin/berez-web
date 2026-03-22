/* ----------------------------------------------------------------------------
Count Up Animation
Animates numbers when they scroll into view
---------------------------------------------------------------------------- */

class CountUp {
	constructor() {
		this.observed = new Set();
		this.init();
	}

	init() {
		const stats = document.querySelectorAll('.stat-value[data-count]');
		if (!stats.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !this.observed.has(entry.target)) {
						this.observed.add(entry.target);
						this.animate(entry.target);
					}
				});
			},
			{ threshold: 0.5 },
		);

		for (const stat of stats) {
			observer.observe(stat);
		}
	}

	animate(element) {
		const target = parseFloat(element.dataset.count);
		const suffix = element.dataset.suffix || '';
		const prefix = element.dataset.prefix || '';
		const duration = 1500;
		const start = performance.now();

		const step = (now) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - (1 - progress) ** 3; // ease-out cubic
			const current = target * eased;

			if (target % 1 === 0) {
				element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
			} else {
				element.textContent = prefix + current.toFixed(1) + suffix;
			}

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				element.textContent = prefix + target.toLocaleString() + suffix;
			}
		};

		requestAnimationFrame(step);
	}
}

// Auto-init
new CountUp();

export default CountUp;

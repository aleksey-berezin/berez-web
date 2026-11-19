// Berez Investment Group
// Three small behaviours. The page works without any of them.

document.documentElement.classList.add('js');

// 1. Reveal: add `.in` to [data-reveal] elements the first time they scroll
//    into view. The CSS decides what that looks like.
// 2. Count up: numbers marked [data-count] run from zero to their value.
const observer = new IntersectionObserver(
	(entries) => {
		for (const { target, isIntersecting } of entries) {
			if (!isIntersecting) continue;
			observer.unobserve(target);
			target.classList.add('in');
			if (target.dataset.count) countUp(target);
		}
	},
	{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
);

for (const element of document.querySelectorAll('[data-reveal], [data-count]')) {
	observer.observe(element);
}

function countUp(element) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const target = Number(element.dataset.count);
	const decimals = (element.dataset.count.split('.')[1] ?? '').length;
	const suffix = element.textContent.replace(/[\d.,]/g, '');
	const format = (value) =>
		value.toLocaleString('en-US', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}) + suffix;

	const duration = 1500;
	const start = performance.now();

	const tick = (now) => {
		const progress = Math.min((now - start) / duration, 1);
		const eased = 1 - (1 - progress) ** 3;
		element.textContent = format(target * eased);
		if (progress < 1) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}

// 3. Mobile menu: the browser opens and closes it (it's a popover);
//    we only need to close it when a link inside is followed.
const menu = document.getElementById('menu');
menu?.addEventListener('click', (event) => {
	if (event.target.closest('a') && menu.matches(':popover-open')) {
		menu.hidePopover();
	}
});

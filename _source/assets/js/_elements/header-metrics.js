/* ----------------------------------------------------------------------------
Header metrics
Keeps CSS vars in sync with the actual fixed header height.
---------------------------------------------------------------------------- */

function setHeaderVars() {
	const header = document.querySelector('.site-header');
	if (!header) return;

	const height = Math.ceil(header.getBoundingClientRect().height);
	document.documentElement.style.setProperty('--header-height', `${height}px`);
}

// Initial
setHeaderVars();

// Keep it updated (fonts/layout changes, responsive)
if ('ResizeObserver' in window) {
	const header = document.querySelector('.site-header');
	if (header) {
		const ro = new ResizeObserver(() => setHeaderVars());
		ro.observe(header);
	}
}

window.addEventListener('resize', () => setHeaderVars(), { passive: true });

// If fonts load after first paint, header height can change slightly.
if (document.fonts?.ready) {
	document.fonts.ready.then(() => setHeaderVars()).catch(() => {});
}

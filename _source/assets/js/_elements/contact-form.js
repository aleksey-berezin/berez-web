/* ----------------------------------------------------------------------------
   Contact Form Handler
   AJAX submission with loading state, error handling, smooth transitions
   ---------------------------------------------------------------------------- */

class ContactForm {
	constructor() {
		this.form = document.querySelector('.contact-form');
		if (!this.form) return;

		this.button = this.form.querySelector('button[type="submit"]');
		this.buttonText = this.button?.textContent || 'Send Message';

		this.init();
	}

	init() {
		this.form.addEventListener('submit', (e) => this.handleSubmit(e));
	}

	async handleSubmit(e) {
		e.preventDefault();

		// Prevent double submission
		if (this.form.classList.contains('is-submitting')) return;

		this.setLoadingState();

		try {
			// FormData automatically includes all form fields, including the hidden inbox_key
			const response = await fetch(this.form.action || window.location.href, {
				method: 'POST',
				body: new FormData(this.form),
				headers: {
					Accept: 'application/json',
				},
			});

			if (response.ok) {
				this.showSuccess();
			} else {
				throw new Error('Submission failed');
			}
		} catch (error) {
			this.showError();
		}
	}

	setLoadingState() {
		this.form.classList.add('is-submitting');
		this.button.disabled = true;
		this.button.textContent = 'Sending...';
	}

	showSuccess() {
		this.form.classList.add('is-success');

		// Find the intro paragraph (sibling before the form)
		const introParagraph = this.form.previousElementSibling;
		const isIntroParagraph =
			introParagraph?.classList.contains('section-text');

		// Fade out form and intro paragraph, then replace content
		setTimeout(() => {
			// Replace intro paragraph with thank you message
			if (isIntroParagraph) {
				introParagraph.style.opacity = '0';
				setTimeout(() => {
					introParagraph.innerHTML =
						'Thank you for reaching out! We\'ll get back to you soon.';
					introParagraph.style.opacity = '1';
				}, 300);
			}

			// Replace form content
			this.form.innerHTML = `
				<div class="form-success" tabindex="-1">
					<h3>Thank you!</h3>
					<p>We'll be in touch soon.</p>
				</div>
			`;
			this.form.classList.remove('is-submitting');
			this.form.querySelector('.form-success').focus();
		}, 300);
	}

	showError() {
		this.form.classList.remove('is-submitting');
		this.button.disabled = false;
		this.button.textContent = this.buttonText;

		// Show error message if not already present
		if (!this.form.querySelector('.form-error')) {
			const error = document.createElement('div');
			error.className = 'form-error';
			error.textContent =
				'Something went wrong. Please try again or email us directly.';
			this.button.parentNode.insertBefore(error, this.button);

			// Remove error after 5 seconds
			setTimeout(() => error.remove(), 5000);
		}
	}
}

// Auto-init
new ContactForm();

export default ContactForm;

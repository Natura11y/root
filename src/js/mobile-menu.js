import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { focusTrap, getFocusableElements } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class MobileMenu {

	// Private properties

	#escapeKeyHandler = this.#handleEscapeKey.bind(this);
	#backdropClickHandler = null;

	// Private methods

	#handleEscapeKey(event) {
		if (event.code === 'Escape') {
			const openMenu = document.querySelector('.mobile-menu.shown');
			if (openMenu) this.#close(openMenu);
		}
	}

	#open(menu) {
		const content = menu.querySelector('.mobile-menu__content');

		if (!content) return;

		menu.classList.add('shown');
		menu.removeAttribute('aria-hidden');

		handleOverlayOpen(content);

		this.#backdropClickHandler = (event) => {
			if (!content.contains(event.target)) {
				this.#close(menu);
			}
		};

		focusTrap(content);

		window.addEventListener('pointerdown', this.#backdropClickHandler);
		window.addEventListener('keydown', this.#escapeKeyHandler);
	}

	#close(menu) {
		menu.classList.remove('shown');

		handleOverlayClose(menu);

		if (this.#backdropClickHandler) {
			window.removeEventListener('pointerdown', this.#backdropClickHandler);
			this.#backdropClickHandler = null;
		}

		window.removeEventListener('keydown', this.#escapeKeyHandler);
	}

	// Public methods

	init() {
		delegateEvent(document, 'click', '[data-mobile-menu="open"]', (event) => {
			const menuId = event.target.getAttribute('aria-controls')?.replace(/^#/, '');
			const menu = document.getElementById(menuId);
			if (menu) this.#open(menu);
		});

		delegateEvent(document, 'click', '[data-mobile-menu-close]', (event) => {
			const menu = event.target.closest('.mobile-menu');
			if (menu) this.#close(menu);
		});
	}
}
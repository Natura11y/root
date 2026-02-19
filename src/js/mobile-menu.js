import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { focusTrap, getFocusableElements } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class MobileMenu {

	// Private properties

	#escapeKeyHandler = this.#handleEscapeKey.bind(this);
	#backdropClickHandler = null;
	#panelStacks = new WeakMap();

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

		this.#resetPanels(menu);
	}

	#resetPanels(menu) {
		const panelsEl = menu.querySelector('.mobile-menu__panels');

		if (!panelsEl) return;

		panelsEl.scrollTo({ left: 0, behavior: 'instant' });

		menu.querySelectorAll('.mobile-menu__panel').forEach((panel, index) => {
			if (index === 0) {
				panel.removeAttribute('inert');
			} else {
				panel.setAttribute('inert', '');
			}
		});

		menu.querySelector('.mobile-menu__header [data-mobile-menu-back]')?.setAttribute('hidden', '');

		const titleEl = menu.querySelector('.mobile-menu__panel-title');

		if (titleEl) {
			titleEl.textContent = '';
			titleEl.setAttribute('hidden', '');
		}

		this.#panelStacks.delete(menu);
	}

	#navigateNext(menu, targetId, label) {
		const panelsEl = menu.querySelector('.mobile-menu__panels');
		const allPanels = [...menu.querySelectorAll('.mobile-menu__panel')];
		const target = menu.querySelector(`#${targetId}`);

		if (!panelsEl || !target) return;

		const targetIndex = allPanels.indexOf(target);

		if (targetIndex === -1) return;

		if (!this.#panelStacks.has(menu)) this.#panelStacks.set(menu, []);

		const currentIndex = Math.round(panelsEl.scrollLeft / panelsEl.offsetWidth);
		const titleEl = menu.querySelector('.mobile-menu__panel-title');

		this.#panelStacks.get(menu).push({
			index: currentIndex,
			title: titleEl?.textContent || ''
		});

		allPanels[currentIndex]?.setAttribute('inert', '');
		target.removeAttribute('inert');

		panelsEl.scrollLeft = targetIndex * panelsEl.offsetWidth;

		target.setAttribute('data-entering', 'next');
		target.addEventListener('animationend', () => target.removeAttribute('data-entering'), { once: true });

		menu.querySelector('.mobile-menu__header [data-mobile-menu-back]')?.removeAttribute('hidden');

		if (titleEl) {
			titleEl.textContent = label;
			titleEl.removeAttribute('hidden');
		}

		getFocusableElements(target)[0]?.focus();
	}

	#navigateBack(menu) {
		const panelsEl = menu.querySelector('.mobile-menu__panels');

		if (!panelsEl || !this.#panelStacks.has(menu)) return;

		const stack = this.#panelStacks.get(menu);

		if (!stack.length) return;

		const allPanels = [...menu.querySelectorAll('.mobile-menu__panel')];
		const currentIndex = Math.round(panelsEl.scrollLeft / panelsEl.offsetWidth);
		const { index: prevIndex, title: prevTitle } = stack.pop();

		allPanels[currentIndex]?.setAttribute('inert', '');

		const prevPanel = allPanels[prevIndex];
		prevPanel?.removeAttribute('inert');

		panelsEl.scrollLeft = prevIndex * panelsEl.offsetWidth;

		prevPanel?.setAttribute('data-entering', 'back');
		prevPanel?.addEventListener('animationend', () => prevPanel.removeAttribute('data-entering'), { once: true });

		const backBtn = menu.querySelector('.mobile-menu__header [data-mobile-menu-back]');
		const titleEl = menu.querySelector('.mobile-menu__panel-title');

		if (prevIndex === 0) {
			backBtn?.setAttribute('hidden', '');

			if (titleEl) {
				titleEl.textContent = '';
				titleEl.setAttribute('hidden', '');
			}
		} else if (titleEl) {
			titleEl.textContent = prevTitle;
		}

		getFocusableElements(prevPanel)[0]?.focus();
	}

	// Public methods

	init() {
		delegateEvent(document, 'click', '[data-mobile-menu="open"]', (event) => {
			const trigger = event.target.closest('[data-mobile-menu="open"]');
			const menuId = trigger?.getAttribute('aria-controls')?.replace(/^#/, '');
			const menu = document.getElementById(menuId);
			if (menu) this.#open(menu);
		});

		delegateEvent(document, 'click', '[data-mobile-menu-close]', (event) => {
			const menu = event.target.closest('.mobile-menu');
			if (menu) this.#close(menu);
		});

		delegateEvent(document, 'click', '[data-mobile-menu-next]', (event) => {
			const menu = event.target.closest('.mobile-menu');
			const btn = event.target.closest('[data-mobile-menu-next]');
			const targetId = btn?.getAttribute('aria-controls')?.replace(/^#/, '');
			const label = btn?.firstChild?.textContent?.trim() || '';
			if (menu && targetId) this.#navigateNext(menu, targetId, label);
		});

		delegateEvent(document, 'click', '[data-mobile-menu-back]', (event) => {
			const menu = event.target.closest('.mobile-menu');
			if (menu) this.#navigateBack(menu);
		});
	}
}

import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { getFocusableElements } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class FlyoutMenu {

	// Private properties

	#escapeKeyHandler = this.#handleEscapeKey.bind(this);
	#backdropClickHandler = null;
	#panelStacks = new WeakMap();

	// Private methods

	#handleEscapeKey(event) {
		if (event.code === 'Escape') {
			const openMenu = document.querySelector('.flyout-menu.shown');
			if (openMenu) this.#handleMenuClose(openMenu);
		}
	}

	#handleMenuOpen(menu) {
		const content = menu.querySelector('.flyout-menu__content');

		if (!content) return;

		menu.classList.add('shown');
		menu.setAttribute('aria-hidden', 'false');

		handleOverlayOpen(content);

		this.#backdropClickHandler = (event) => {
			if (!content.contains(event.target)) {
				this.#handleMenuClose(menu);
			}
		};

		window.addEventListener('pointerdown', this.#backdropClickHandler);
		window.addEventListener('keydown', this.#escapeKeyHandler);
	}

	#handleMenuClose(menu) {
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
		menu.querySelectorAll('.flyout-menu__panel').forEach((panel, index) => {
			if (index === 0) {
				panel.removeAttribute('inert');
			} else {
				panel.setAttribute('inert', '');
			}
		});

		menu.querySelector('.flyout-menu__header [data-flyout-menu-back]')?.setAttribute('hidden', '');

		this.#panelStacks.delete(menu);
	}

	#animateEnter(el) {
		el.setAttribute('data-entering', '');
		el.addEventListener('animationend', () => el.removeAttribute('data-entering'), { once: true });
	}

	#navigateNext(menu, targetId) {
		const allPanels = [...menu.querySelectorAll('.flyout-menu__panel')];
		const target = menu.querySelector(`#${targetId}`);

		if (!target) return;

		const targetIndex = allPanels.indexOf(target);

		if (targetIndex === -1) return;

		if (!this.#panelStacks.has(menu)) this.#panelStacks.set(menu, []);

		const currentPanel = allPanels.find(p => !p.hasAttribute('inert')) ?? allPanels[0];
		const currentIndex = allPanels.indexOf(currentPanel);

		this.#panelStacks.get(menu).push(currentIndex);

		currentPanel.setAttribute('inert', '');
		target.removeAttribute('inert');
		this.#animateEnter(target);

		const backBtn = menu.querySelector('.flyout-menu__header [data-flyout-menu-back]');

		if (backBtn?.hidden) {
			backBtn.removeAttribute('hidden');
			this.#animateEnter(backBtn);
		}

		target.setAttribute('tabindex', '-1');
		target.focus({ preventScroll: true });
		target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
	}

	#navigateBack(menu) {
		if (!this.#panelStacks.has(menu)) return;

		const stack = this.#panelStacks.get(menu);

		if (!stack.length) return;

		const allPanels = [...menu.querySelectorAll('.flyout-menu__panel')];
		const currentPanel = allPanels.find(p => !p.hasAttribute('inert')) ?? allPanels[0];
		const prevIndex = stack.pop();
		const prevPanel = allPanels[prevIndex];

		currentPanel.setAttribute('inert', '');
		prevPanel.removeAttribute('inert');
		this.#animateEnter(prevPanel);

		if (prevIndex === 0) {
			menu.querySelector('.flyout-menu__header [data-flyout-menu-back]')?.setAttribute('hidden', '');
		}

		getFocusableElements(prevPanel)[0]?.focus({ preventScroll: true });
	}

	// Public methods

	init() {
		document.querySelectorAll('.flyout-menu').forEach(menu => this.#resetPanels(menu));

		delegateEvent(document, 'click', '[data-flyout-menu="open"]', (event) => {
			const trigger = event.target.closest('[data-flyout-menu="open"]');
			const menuId = trigger?.getAttribute('aria-controls')?.replace(/^#/, '');
			const menu = document.getElementById(menuId);
			if (menu) this.#handleMenuOpen(menu);
		});

		delegateEvent(document, 'click', '[data-flyout-menu-close]', (event) => {
			const menu = event.target.closest('.flyout-menu');
			if (menu) this.#handleMenuClose(menu);
		});

		delegateEvent(document, 'click', '[data-flyout-menu-next]', (event) => {
			const menu = event.target.closest('.flyout-menu');
			const btn = event.target.closest('[data-flyout-menu-next]');
			const targetId = btn?.getAttribute('aria-controls')?.replace(/^#/, '');
			if (menu && targetId) this.#navigateNext(menu, targetId);
		});

		delegateEvent(document, 'click', '[data-flyout-menu-back]', (event) => {
			const menu = event.target.closest('.flyout-menu');
			if (menu) this.#navigateBack(menu);
		});

		document.querySelectorAll('[data-flyout-menu="open"]').forEach(trigger => {
			const menuId = trigger.getAttribute('aria-controls')?.replace(/^#/, '');
			const menu = document.getElementById(menuId);
			if (!menu) return;
			new ResizeObserver(() => {
				if (menu.classList.contains('shown') && !trigger.offsetWidth) {
					this.#handleMenuClose(menu);
				}
			}).observe(trigger);
		});
	}
}

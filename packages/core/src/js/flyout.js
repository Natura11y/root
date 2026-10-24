import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { removeFocusTrap } from './utilities/focus';

export default class Flyout {

	// Private properties

	static #initializedRoots = new WeakMap();

	#root = null;
	#resizeObserver = null;
	#escapeKeyHandler = this.#handleEscapeKey.bind(this);
	#panelStacks = new WeakMap();

	// Private methods

	#getMenu(trigger) {
		const id = trigger.getAttribute('aria-controls')?.replace(/^#/, '');
		return id ? this.#root.querySelector(`#${CSS.escape(id)}`) : null;
	}

	#handleClick = (event) => {
		const trigger = event.target.closest('[data-open="flyout"]');

		if (trigger) {
			const menu = this.#getMenu(trigger);
			if (menu) this.#handleMenuOpen(menu);
			return;
		}

		const menu = event.target.closest('.flyout');
		if (!menu || !this.#root.contains(menu)) return;

		const next = event.target.closest('[data-flyout-next]');

		if (event.target === menu || event.target.closest('[data-flyout-close]')) {
			this.#handleMenuClose(menu);
		} else if (next) {
			const targetId = next.getAttribute('aria-controls')?.replace(/^#/, '');
			if (targetId) this.#navigateNext(menu, targetId);
		} else if (event.target.closest('[data-flyout-back]')) {
			this.#navigateBack(menu);
		}
	};

	#handleResize = (entries) => {
		entries.forEach(({ target }) => {
			const menu = this.#getMenu(target);
			if (menu?.classList.contains('shown') && !target.offsetWidth) {
				this.#handleMenuClose(menu);
			}
		});
	};

	#handleEscapeKey(event) {
		if (event.code === 'Escape') {
			const openMenu = this.#root.querySelector('.flyout.shown');
			if (openMenu) this.#handleMenuClose(openMenu);
		}
	}

	#handleMenuOpen(menu) {
		const content = menu.querySelector('.flyout__content');
		const closeBtn = content?.querySelector('[data-flyout-close]');

		if (!content || menu.classList.contains('shown')) return;

		this.#resetPanels(menu);
		menu.classList.add('shown');
		menu.setAttribute('aria-hidden', 'false');

		handleOverlayOpen(content, null, closeBtn);

		window.addEventListener('keydown', this.#escapeKeyHandler);
	}

	#handleMenuClose(menu) {
		if (!menu.classList.contains('shown')) return;

		menu.classList.remove('shown');
		removeFocusTrap(menu.querySelector('.flyout__content'));
		handleOverlayClose(menu);

		window.removeEventListener('keydown', this.#escapeKeyHandler);
	}

	#resetPanels(menu) {
		menu.querySelectorAll('.flyout__panel').forEach((panel, index) => {
			if (index === 0) {
				panel.removeAttribute('inert');
			} else {
				panel.setAttribute('inert', '');
			}
		});

		menu.querySelector('.flyout__header [data-flyout-back]')?.setAttribute('hidden', '');

		this.#panelStacks.delete(menu);
	}

	#animateEnter(el) {
		el.setAttribute('data-entering', '');
		el.addEventListener('animationend', () => el.removeAttribute('data-entering'), { once: true });
	}

	#navigateNext(menu, targetId) {
		const allPanels = [...menu.querySelectorAll('.flyout__panel')];
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

		const backBtn = menu.querySelector('.flyout__header [data-flyout-back]');

		if (backBtn?.hidden) {
			backBtn.removeAttribute('hidden');
			this.#animateEnter(backBtn);
		}

		backBtn?.focus({ preventScroll: true });
	}

	#navigateBack(menu) {
		if (!this.#panelStacks.has(menu)) return;

		const stack = this.#panelStacks.get(menu);

		if (!stack.length) return;

		const allPanels = [...menu.querySelectorAll('.flyout__panel')];
		const currentPanel = allPanels.find(p => !p.hasAttribute('inert')) ?? allPanels[0];
		const prevIndex = stack.pop();
		const prevPanel = allPanels[prevIndex];

		currentPanel.setAttribute('inert', '');
		prevPanel.removeAttribute('inert');
		this.#animateEnter(prevPanel);

		if (prevIndex === 0) {
			menu.querySelector('.flyout__header [data-flyout-back]')?.setAttribute('hidden', '');
		}

		menu.querySelector('[data-flyout-close]')?.focus({ preventScroll: true });
	}

	// Public methods

	init(root = document) {
		const owner = Flyout.#initializedRoots.get(root);
		if (owner && owner !== this) return owner.init(root);

		if (this.#root && this.#root !== root) this.destroy();
		this.#root = root;

		root.querySelectorAll('.flyout').forEach(menu => {
			if (!menu.classList.contains('shown')) this.#resetPanels(menu);
		});

		if (!owner) {
			root.addEventListener('click', this.#handleClick);
			this.#resizeObserver = new ResizeObserver(this.#handleResize);
			Flyout.#initializedRoots.set(root, this);
		}

		root.querySelectorAll('[data-open="flyout"]').forEach(trigger => {
			if (this.#getMenu(trigger)) this.#resizeObserver.observe(trigger);
		});

		return this;
	}

	destroy() {
		if (!this.#root) return;

		this.#root.querySelectorAll('.flyout.shown').forEach(menu => this.#handleMenuClose(menu));
		this.#root.removeEventListener('click', this.#handleClick);
		this.#resizeObserver.disconnect();
		this.#resizeObserver = null;
		Flyout.#initializedRoots.delete(this.#root);
		this.#root = null;
	}
}

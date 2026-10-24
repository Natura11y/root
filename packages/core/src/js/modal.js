import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { getFocusableElements, removeFocusTrap } from './utilities/focus';

export default class Modal {

	// Private properties

	static #initializedRoots = new WeakMap();

	#root = null;

	#outsideClickHandlers = new Map();
	#modalCloseHandlers = new Map();
	#escapeKeyHandler = this.#handleEscapeKey.bind(this);

	// Private methods
	
  #addOutsideClickHandler(modal, handler) {
		this.#removeOutsideClickHandler(modal);

		const handleDelayedOutsideClick = (event) => {
			const modalContent = modal.querySelector('.modal__content');
			if (!modalContent.contains(event.target)) {
				handler(event);
			}
		};

		window.addEventListener('pointerdown', handleDelayedOutsideClick);
		this.#outsideClickHandlers.set(modal, handleDelayedOutsideClick);
	}

	#removeOutsideClickHandler(modal) {
		const handler = this.#outsideClickHandlers.get(modal);
		if (handler) {
			window.removeEventListener('pointerdown', handler);
			this.#outsideClickHandlers.delete(modal);
		}
	}

	#addModalCloseHandlers(modal) {
		const modalCloseList = modal.querySelectorAll('[data-modal-close]');
		const handlers = [];

		modalCloseList.forEach((modalClose) => {
			const handler = () => this.#handleModalClose(modal);
			modalClose.addEventListener('click', handler);
			modalClose.setAttribute('aria-label', 'Close Modal Window');
			handlers.push({ element: modalClose, handler });
		});

		this.#modalCloseHandlers.set(modal, handlers);
	}

	#removeModalCloseHandlers(modal) {
		const handlers = this.#modalCloseHandlers.get(modal);
		if (handlers) {
			handlers.forEach(({ element, handler }) => {
				element.removeEventListener('click', handler);
			});
			this.#modalCloseHandlers.delete(modal);
		}
	}

	#handleEscapeKey(event) {
		if (event.code === 'Escape') {
			this.#modalCloseHandlers.forEach((handlers, modal) => this.#handleModalClose(modal));
		}
	}

	#handleModalClose(modalTarget) {
		modalTarget.classList.remove('shown');
		modalTarget.inert = true;

		removeFocusTrap(modalTarget.querySelector('.modal__content'));
		handleOverlayClose(modalTarget);
		this.#removeOutsideClickHandler(modalTarget);
		this.#removeModalCloseHandlers(modalTarget);

		if (!this.#modalCloseHandlers.size) {
			window.removeEventListener('keydown', this.#escapeKeyHandler);
		}
	}

	#handleClick = (event) => {
		const button = event.target.closest('[data-modal="open"]');
		if (!button || !this.#root.contains(button)) return;

		const id = button.getAttribute('aria-controls')?.replace(/^#/, '');
		const target = id ? this.#root.querySelector(`#${CSS.escape(id)}`) : null;
		this.openModal(target);
	};

	// Public methods

	openModal(modalTarget) {

		if (!modalTarget) {
			console.warn('Modal target not found.');
			return;
		}

		modalTarget.setAttribute('aria-hidden', 'false');
		modalTarget.inert = false;
		modalTarget.classList.add('shown');

		const modalContent = modalTarget.querySelector('.modal__content');

		if (!modalContent) {
			console.warn('Modal content not found.');
			return;
		}

		// Remove existing handlers and add new ones
		this.#removeModalCloseHandlers(modalTarget);
		this.#addModalCloseHandlers(modalTarget);

		handleOverlayOpen(modalContent, null, getFocusableElements(modalContent)[0]);

		if (modalTarget.classList.contains('modal--scroll-all')) {
			modalTarget.scrollTop = 0;
		}

		if (modalTarget.dataset.modalCloseOutside === 'true') {
			const handleCloseOutside = () => this.#handleModalClose(modalTarget);
			this.#addOutsideClickHandler(modalTarget, handleCloseOutside);
		}

		window.addEventListener('keydown', this.#escapeKeyHandler);
	}

	init(root = document) {
		const owner = Modal.#initializedRoots.get(root);
		if (owner && owner !== this) return owner.init(root);

		if (this.#root && this.#root !== root) this.destroy();
		this.#root = root;

		root.querySelectorAll('.modal').forEach((modal) => {
			if (!modal.classList.contains('shown')) {
				modal.inert = true;
			}
		});

		if (!owner) {
			root.addEventListener('click', this.#handleClick);
			Modal.#initializedRoots.set(root, this);
		}

		return this;
	}

	destroy() {
		this.#modalCloseHandlers.forEach((handlers, modal) => this.#handleModalClose(modal));

		if (!this.#root) return;

		this.#root.removeEventListener('click', this.#handleClick);
		Modal.#initializedRoots.delete(this.#root);
		this.#root = null;
	}
}

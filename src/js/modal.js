import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { delegateEvent } from './utilities/eventDelegation';

export default class Modal {

	// Private properties

	#outsideClickHandlers = new Map();
	#modalCloseHandlers = new Map();
	#escapeKeyHandler = this.#handleEscapeKey.bind(this);

	// Private methods
	
  #addOutsideClickHandler(modal, handler) {
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
			const openModals = document.querySelectorAll('.modal.shown');
			openModals.forEach((modal) => this.#handleModalClose(modal));
		}
	}

	#handleModalClose(modalTarget) {
		modalTarget.classList.remove('shown');
		
		handleOverlayClose(modalTarget);
		this.#removeOutsideClickHandler(modalTarget);
		this.#removeModalCloseHandlers(modalTarget);

		window.removeEventListener('keydown', this.#escapeKeyHandler);
	}

	// Public methods

	openModal(modalTarget) {

		if (!modalTarget) {
			console.warn('Modal target not found.');
			return;
		}

		modalTarget.classList.add('shown');
		modalTarget.focus();

		const modalContent = modalTarget.querySelector('.modal__content');

		if (!modalContent) {
			console.warn('Modal content not found.');
			return;
		}

		handleOverlayOpen(modalContent);

		if (modalTarget.classList.contains('modal--scroll-all')) {
			modalTarget.scrollTop = 0;
		}

		// Remove existing handlers and add new ones
		this.#removeModalCloseHandlers(modalTarget);
		this.#addModalCloseHandlers(modalTarget);

		if (modalTarget.dataset.modalCloseOutside === 'true') {
			const handleCloseOutside = () => this.#handleModalClose(modalTarget);
			this.#addOutsideClickHandler(modalTarget, handleCloseOutside);
		}

		window.addEventListener('keydown', this.#escapeKeyHandler);
	}

	init() {
		delegateEvent(document, 'click', '[data-modal="open"]', (event) => {
			const modalTargetID = event.target.getAttribute('aria-controls')?.replace(/^#/, '');
			const modalTarget = document.getElementById(modalTargetID);
			this.openModal(modalTarget);
		});
	}
}
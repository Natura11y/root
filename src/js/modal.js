import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';

//////////////////////////////////////////////
// Modal
//////////////////////////////////////////////

export default class Modal {

  #modalList = document.querySelectorAll('.modal');
  #modalButtonList = document.querySelectorAll('[data-modal-open]');

  init() {

    const initModal = (modalTarget) => {

      if (!modalTarget) {
        console.warn('Modal target not found.');
        return;
      }

      handleOverlayOpen(modalTarget);

      const modalContent = modalTarget.querySelector('.modal__content');

      if (!modalContent) {
        console.warn('Modal content not found.');
        return;
      }

      modalContent.setAttribute('tabindex', 0);
      modalContent.focus();
      modalContent.setAttribute('tabindex', -1);

      if (modalTarget.classList.contains('modal--scroll-all')) {
        modalTarget.scrollTop = 0;
      }

      const modalCloseList = modalTarget.querySelectorAll('[data-modal-close]');

      const handleCloseOutside = (event) => {
        
        let modalContentClick = modalContent.contains(event.target);

        if (!modalContentClick) {
          handleOverlayClose(modalTarget);
        }

        window.removeEventListener('click', handleCloseOutside);
      
      }

      modalCloseList.forEach((modalClose) => {

        modalClose.addEventListener('click', () => {
          handleOverlayClose(modalTarget)
        });

        modalClose.setAttribute('aria-label', 'Close Modal Window');
      
      });

      if (modalTarget.dataset.modalCloseOutside === 'true') {
        window.addEventListener('click', handleCloseOutside);
      }

    }

    this.#modalList.forEach((modal) => {
      const modalContainer = modal.querySelector('.modal__content');

      modalContainer.setAttribute('role', 'dialog');
      modalContainer.setAttribute('aria-modal', true);

      modal.setAttribute('aria-hidden', true);
    });

    this.#modalButtonList.forEach((modalButton) => {

      modalButton.addEventListener('click', (event) => {
        const modalTargetID = event.target.getAttribute('data-modal-open').replace(/#/, '');
        const modalTarget = document.getElementById(modalTargetID)

        initModal(modalTarget);

        event.stopPropagation();
      });

    });
  
  }

}
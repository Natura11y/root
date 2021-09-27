import './_style.scss';

import { getFocusableElements } from '../../utilities/focus.js';

//////////////////////////////////////////////
// Modal
//////////////////////////////////////////////

export default class Modal {

    constructor() {

        const modalList = document.querySelectorAll('.modal');
        const modalButtonList = document.querySelectorAll('[data-modal-open]');

        const initModal = (modalTarget) => {
            
            document.querySelector('body').classList.add('modal-open');
            
            modalTarget.setAttribute('aria-hidden', false);

            const lastFocusedElement = document.activeElement;

            const modalCloseList = modalTarget.querySelectorAll('[data-modal-close]');

            const handleCloseOutside = (event) => {

                const modalContent = modalTarget.querySelector('.modal__content');

                let modalContentClick = modalContent.contains(event.target);

                if (!modalContentClick) {
                    handleClose();
                }
            };

            const handleClose = () => {
                
                modalTarget.setAttribute('aria-hidden', true);

                lastFocusedElement.focus();
                
                document.querySelector('body').classList.remove('modal-open');

                window.removeEventListener('click', handleCloseOutside);
            }

            const modalFocusableElements = new Array([
                'a:not([disabled]',
                'button:not([disabled])',
                'input:not([disabled])'
            ]);

            // const modalBody = modalTarget.querySelector('.modal__content__body');

            const focusableElements = getFocusableElements(modalTarget);

            const firstElementOfModal = focusableElements[0];
            const lastElementOfModal = focusableElements[focusableElements.length - 1];

            console.log("We're focusable", focusableElements);

            firstElementOfModal.focus();
              
            modalTarget.addEventListener('keydown', (event) => {

                const keyCodes = {
                    tab: 9,
                    esc: 27
                };

                const key = event.keyCode;

                switch (key) {
                    case keyCodes.tab:

                        if (document.activeElement === lastElementOfModal) {
                            if(!event.shiftKey){
                                event.preventDefault();
                                focusableElements[0].focus();
                            }
                        }

                        if(document.activeElement === firstElementOfModal){
                            if(event.shiftKey){
                                event.preventDefault();
                                lastElementOfModal.focus();
                            }
                        }

                        break;
                    
                    case keyCodes.esc:
                        closeModal();
                        break;
                }

            });

            modalCloseList.forEach((modalClose) => {
                modalClose.addEventListener('click', handleClose);
                modalClose.setAttribute('aria-label', 'Close Modal Window');
            });

            if( modalTarget.hasAttribute('data-modal-close-outside')) {
                window.addEventListener('click', handleCloseOutside);
            }
        }

        modalList.forEach((modal) => {

            const modalContainer = modal.querySelector('.modal__content');
    
            modalContainer.setAttribute('role', 'dialog');
            modalContainer.setAttribute('aria-modal', true);
    
            modal.setAttribute('aria-hidden', true);

        });

        modalButtonList.forEach((modalButton) => {
            
            modalButton.addEventListener('click', (event) => {

                const modalTargetID = event.target.getAttribute('data-modal-open').replace(/#/, '');
                const modalTarget = document.getElementById(modalTargetID);
    
                initModal(modalTarget);

                event.stopPropagation();
                
            });

        });
        
    }
}
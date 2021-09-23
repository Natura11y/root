import './_style.scss';

//////////////////////////////////////////////
// Modal
//////////////////////////////////////////////

export default class Modal {

    constructor() {

        const modalList = document.querySelectorAll(".modal");
        const modalButtonList = document.querySelectorAll("[data-modal-open]");

        const initModal = (modalTarget) => {

            document.querySelector('body').classList.add('modal-open');
            
            const lastFocusedElement = document.activeElement;

            const modalCloseList = modalTarget.querySelectorAll("[data-modal-close]");

            const closeModal = () => {
                modalTarget.setAttribute("aria-hidden", true);
                lastFocusedElement.focus();
                document.querySelector('body').classList.remove('modal-open');
            }

            modalTarget.setAttribute("aria-hidden", false);

            modalCloseList.forEach((modalClose) => {
                modalClose.addEventListener("click", closeModal);
                modalClose.setAttribute("aria-label", "Close Modal Window");
            });

            // All focusable modal elements
            const modalFocusableElements = [
                'input:not([disabled])',
                'button:not([disabled])',
                'a:not([disabled]'
            ];

            const modalBody = modalTarget.querySelector('.modal__content__body');

            const focusableElements = modalTarget.querySelectorAll(modalFocusableElements);

            const firstElementOfModal = modalBody.querySelector(modalFocusableElements);
            const lastElementOfModal = focusableElements[focusableElements.length - 1];

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
                            event.preventDefault();
                            focusableElements[0].focus();
                        }
                        break;
                    case keyCodes.esc:
                        closeModal();
                        break;
                }

            });

        }

        modalList.forEach((modal) => {
            
            const modalContainer = modal.querySelector(".modal__content");
    
            modalContainer.setAttribute("role", "dialog");
            modalContainer.setAttribute("aria-modal", true);
    
            modal.setAttribute("aria-hidden", true);

        });

        modalButtonList.forEach((modalButton) => {
            
            modalButton.addEventListener("click", (event) => {
    
                const modalTargetID = event.target.getAttribute("data-modal-open").replace(/#/, "");
                const modalTarget = document.getElementById(modalTargetID);
    
                initModal(modalTarget);
                
            });

        });
        
    }
}
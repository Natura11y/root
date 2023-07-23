/*

In this file:

// A. Focusable Elements
// B. Focus Trap

*/

import { handleOverlayClose } from './overlay';

//////////////////////////////////////////////
// A. Focusable Elements
//////////////////////////////////////////////

export const getFocusableElements = (element = document) => {
    
    const els = [
      'a[href]',
      'button',
      'input',
      'textarea',
      'select',
      'details',
      '[tabindex]:not([tabindex="-1"])',
      'video',
      'audio',
      'iframe',
    ];

    return [...element.querySelectorAll(els)].filter(
      (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    );
}

//////////////////////////////////////////////
// B. Focus Trap
//////////////////////////////////////////////

export const focusTrap = (element) => {

    const focusableElements = getFocusableElements(element);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.focus();
    
    element.addEventListener('keydown', (event) => {

        switch (event.code) {
            case 'Tab':

                if (document.activeElement === lastFocusableElement) {
                    if (!event.shiftKey) {
                        event.preventDefault();
                        firstFocusableElement.focus();
                    }
                }

                if (document.activeElement === firstFocusableElement) {
                    if (event.shiftKey) {
                        event.preventDefault();
                        lastFocusableElement.focus();
                    }
                }

                break;

            case 'Escape':
                handleOverlayClose(element);
                break;
            
            default:
                // do nothing
        }
    
    });

}
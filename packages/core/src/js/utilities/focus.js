/*

In this file:

// A. Focusable Elements
// B. Focus Trap

*/

import { handleOverlayClose } from './overlay.js';

// Track active focus trap handlers to prevent memory leaks
const activeFocusTraps = new Map();

//////////////////////////////////////////////
// A. Focusable Elements
//////////////////////////////////////////////

export const getFocusableElements = (element = document, options = {}) => {

    const { exclude = [] } = options;

    const els = [
        'a[href]',
        'area',
        'button',
        'details',
        'frame',
        'iframe',
        'input',
        'object',
        'summary',
        'textarea',
        'select',
        '[tabindex]:not([tabindex="-1"])',
        'video',
        'audio'
    ];

    return [...element.querySelectorAll(els)].filter((el) => {
        return el.tabIndex >= 0 &&
               !el.matches(':disabled') &&
               !el.closest('[inert]') &&
               !el.closest('[hidden]') &&
               !exclude.some(exclusion => el.closest(exclusion)) &&
               el.getClientRects().length > 0 &&
               getComputedStyle(el).visibility === 'visible';
    });
}

//////////////////////////////////////////////
// B. Focus Trap
//////////////////////////////////////////////

export const focusTrap = (element, firstFocusTarget = element) => {

    // Only add tabindex if element isn't already natively focusable
    if (firstFocusTarget.tabIndex < 0) {
        firstFocusTarget.setAttribute('tabindex', '-1');
    }
    
    firstFocusTarget.focus();

    // Remove the previous trap before registering its replacement.
    removeFocusTrap(element);

    // Create new keydown handler
    const keydownHandler = (event) => {

        switch (event.code) {
            case 'Tab': {

                // Query dynamically to respect inert/hidden state changes after panel navigation
                const focusableElements = getFocusableElements(element);
                if (!focusableElements.length) {
                    event.preventDefault();
                    break;
                }

                const firstFocusableElement = focusableElements[0];
                const lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (
                    event.shiftKey &&
                    (document.activeElement === element || document.activeElement === firstFocusableElement)
                ) {
                    event.preventDefault();
                    lastFocusableElement?.focus();
                } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement?.focus();
                }

                break;
            }

            case 'Escape':
                handleOverlayClose(element);
                break;

            default:
                // do nothing
        }
    };

    // Add new handler and store it for cleanup
    element.addEventListener('keydown', keydownHandler);
    activeFocusTraps.set(element, keydownHandler);
}


export const removeFocusTrap = (element) => {
    const handler = activeFocusTraps.get(element);
    if (!handler) return;

    element.removeEventListener('keydown', handler);
    activeFocusTraps.delete(element);
}

/*

In this file:

// A. Focusable Elements
// B. Focus Trap

*/

import { handleOverlayClose } from './overlay';

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
        return !el.hasAttribute('disabled') &&
               !el.closest('[inert]') &&
               !el.closest('[hidden]') &&
               !exclude.some(exclusion => el.closest(exclusion));
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

    // Remove existing focus trap handler if any to prevent memory leaks
    const existingHandler = activeFocusTraps.get(element);
    if (existingHandler) {
        element.removeEventListener('keydown', existingHandler);
    }

    // Create new keydown handler
    const keydownHandler = (event) => {

        switch (event.code) {
            case 'Tab': {

                // Query dynamically to respect inert/hidden state changes after panel navigation
                const focusableElements = getFocusableElements(element);
                const firstFocusableElement = focusableElements[0];
                const lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (document.activeElement === lastFocusableElement) {
                    if (!event.shiftKey) {
                        event.preventDefault();
                        firstFocusableElement?.focus();
                    }
                }

                if (document.activeElement === firstFocusableElement) {
                    if (event.shiftKey) {
                        event.preventDefault();
                        lastFocusableElement?.focus();
                    }
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

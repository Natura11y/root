/*

In this file:

// A. Overlay Open and Close

*/

import { focusTrap } from './focus';

//////////////////////////////////////////////
// A. Overlay Open and Close
//////////////////////////////////////////////

let scrollPosition = 0;
let rootElement;
let lastFocusedElement;

if (typeof document !== 'undefined') {
    rootElement = document.querySelector(':root');
}

export const handleOverlayOpen = (element = null, triggerElement = null) => {
    lastFocusedElement = triggerElement || document.activeElement;

    scrollPosition = window.scrollY;

    rootElement.style.setProperty('--scroll-position', `-${scrollPosition}px`);

    rootElement.classList.add('has-overlay');

    if(element && element.getAttribute('aria-hidden') === 'true'){
        element.setAttribute('aria-hidden', false);
    }

    if(element) {
        focusTrap(element);
    }
}

export const handleOverlayClose = (element = null) => {
    rootElement.removeAttribute('style');

    rootElement.classList.remove('has-overlay');

    if(!rootElement.classList.length){ 
        rootElement.removeAttribute('class');
    }

    window.scrollTo({ top: scrollPosition, behavior: 'instant' });

    if(element && element.getAttribute('aria-hidden') === 'false'){
        element.setAttribute('aria-hidden', true);
    }

    if (element && lastFocusedElement) {
        lastFocusedElement.focus();
    }
}
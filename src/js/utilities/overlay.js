/*

In this file:

// A. Overlay Open and Close

*/

import { focusTrap } from './focus';

//////////////////////////////////////////////
// A. Overlay Open and Close
//////////////////////////////////////////////

let scrollPosition = 0;
let rootElement = document.querySelector('html');
let lastFocusedElement;

export const handleOverlayOpen = (element) => {

    lastFocusedElement = document.activeElement;

    scrollPosition = window.pageYOffset;

    rootElement.style.setProperty('--scroll-position', `-${scrollPosition}px`);

    rootElement.classList.add('has-overlay');

    element.setAttribute('aria-hidden', false);

    focusTrap(element);
}

export const handleOverlayClose = (element, event) => {

    rootElement.removeAttribute('style');

    rootElement.classList.remove('has-overlay');

    if(!rootElement.classList.length){ 
        rootElement.removeAttribute('class');
    }
    
    element.setAttribute('aria-hidden', true);

    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    
    lastFocusedElement.focus();
}
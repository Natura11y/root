import './_style.scss';

import { getFocusableElements } from '../../utilities/focus';

//////////////////////////////////////////////
// Accessibility
//////////////////////////////////////////////

export default class Accessibility {

    constructor() {
        
        const focusableElements = getFocusableElements();
        
        focusableElements.forEach((focusableElement) => {

            let mouseDown = false;

            focusableElement.addEventListener('mousedown', () => {
                mouseDown = true;
            });

            focusableElement.addEventListener('mouseup', () => {
                mouseDown = false;
            });

            focusableElement.addEventListener('focus', (event) => {
                if (mouseDown) {
                    event.target.blur();
                }
            });

        });

    }
}
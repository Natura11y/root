import './_style.scss';

//////////////////////////////////////////////
// Accessibility
//////////////////////////////////////////////

export default class Accessibility {

    constructor() {

        const focusableElements = [
            'a[href]',
            'button',
            '[role="tab"]',
            '[data-toggle="accordion"]',
            'a:not([disabled]'
        ];
            
        const focusableElementList = document.querySelectorAll(focusableElements);

        focusableElementList.forEach((focusableElement) => {

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
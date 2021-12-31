import './_style.scss';

//////////////////////////////////////////////
// Accessibility
//////////////////////////////////////////////

export default class Accessibility {

    constructor() {
        
        const elements = [
            'a[href]',
            'button',
            '[role="tab"]',
            '[data-toggle="accordion"]'
        ];

        const initFocus = () => {

            const focusableElementList = document.querySelectorAll(elements);

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

        window.addEventListener('load', initFocus, { once: true });
    }
}
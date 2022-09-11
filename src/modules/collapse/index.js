import './_style.scss';

import { getFocusableElements } from '../../utilities/focus';

//////////////////////////////////////////////
// Collapse
//////////////////////////////////////////////

export default class Collapse {

    constructor(collapseButton) {
        this.collapseButtonList = document.querySelectorAll(collapseButton);
    }

    init() {

        this.collapseButtonList.forEach((collapseButton) => {

            collapseButton.setAttribute('aria-expanded', false);
    
            collapseButton.addEventListener('click', (event) => {

                const collapseTargetID = event.target.getAttribute('data-target-toggle').replace(/#/, '');
                const collapseTarget = document.getElementById(collapseTargetID);

                const focusableElements = getFocusableElements(collapseTarget);
                const firstFocusableElement = focusableElements[0];

                let isExpanded = collapseButton.getAttribute('aria-expanded');

                const handleClose = (button, target) => {
                    button.setAttribute('aria-expanded', false);
                    target.classList.remove('shown');
                }

                const handleOpen = (button, target) => {
                    button.setAttribute('aria-expanded', true);
                    target.classList.add('shown');
                }

                if (isExpanded === 'true') {
                    handleClose(collapseButton, collapseTarget);

                } else if (isExpanded === 'false') {
                    handleOpen(collapseButton, collapseTarget);
                    if (collapseTarget.hasAttribute('data-focus-first')) {
                        firstFocusableElement.focus();

                    }
                }

                collapseTarget.addEventListener('keydown', (event) => {

                    switch (event.code) {
                        case 'Tab':

                            if(document.activeElement === firstFocusableElement){
                                if(event.shiftKey){
                                    event.preventDefault();
                                    collapseButton.focus();
                                }
                            }

                            break;
                        
                        case 'Escape':
                            handleClose(collapseButton, collapseTarget);
                            break;
                        default:
                        // do nothing
                    }

                });

                const hasCloseTarget = collapseButton.hasAttribute('data-target-close');

                if(hasCloseTarget) {
                    const closeTargetID = event.target.getAttribute('data-target-close').replace(/#/, '');
                    const closeTarget = document.getElementById(closeTargetID);
                    const closeTargetButton = document.querySelector(`[data-target-toggle="#${closeTargetID}"]`);

                    console.log(`Close target ID: ${closeTargetButton}`);

                    handleClose(closeTargetButton, closeTarget);
                }

            });

        });
    }
}
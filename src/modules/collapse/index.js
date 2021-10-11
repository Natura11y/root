import './_style.scss';

import { getFocusableElements } from '../../utilities/focus';

//////////////////////////////////////////////
// Collapse
//////////////////////////////////////////////

export default class Collapse {

    constructor() {

        const collapseButtonList = document.querySelectorAll('[data-target-toggle]');

        collapseButtonList.forEach((collapseButton) => {

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
                    firstFocusableElement.focus();
                }

                collapseTarget.addEventListener('keydown', (event) => {

                    const keyCodes = {
                        tab: 9,
                        esc: 27
                    };

                    const key = event.keyCode;

                    switch (key) {
                        case keyCodes.tab:

                            if(document.activeElement === firstFocusableElement){
                                if(event.shiftKey){
                                    event.preventDefault();
                                    collapseButton.focus();
                                }
                            }

                            break;
                        
                        case keyCodes.esc:
                            handleClose(collapseButton, collapseTarget);
                            break;
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
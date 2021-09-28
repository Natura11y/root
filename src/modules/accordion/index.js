import './_style.scss';

import { getFocusableElements } from '../../utilities/focus';

//////////////////////////////////////////////
// Accordion
//////////////////////////////////////////////

export default class Accordion {

    constructor() {
        
        const accordionList = document.querySelectorAll('.accordion');

        accordionList.forEach((accordion) => {

            const accordionButtonList = accordion.querySelectorAll('[data-toggle="accordion"]');
            const accordionPanelList = accordion.querySelectorAll('[data-accordion="panel"]');

            const setFocusableElements = (element = document, focusable = false) => {

                const focusableElementList = getFocusableElements(element);

                for (const focusableElement of focusableElementList) {
                    if (focusable === true) {
                        focusableElement.setAttribute('tabindex', 0);
                    } else if (focusable === false) {
                        focusableElement.setAttribute('tabindex', -1);
                    }
                }
            }

            accordionButtonList.forEach((accordionButton, index) => {

                const currentAccordionPanel = accordionButton.nextElementSibling;
                let isExpanded = accordionButton.getAttribute('aria-expanded');

                accordionButton.setAttribute('tabindex', 0);

                if (isExpanded === 'true') {
                    currentAccordionPanel.style.maxHeight = currentAccordionPanel.scrollHeight + 'px';
                    currentAccordionPanel.classList.add('show');

                    setFocusableElements(currentAccordionPanel, true);

                } else {
                    accordionButton.setAttribute('aria-expanded', false);
                    currentAccordionPanel.style.maxHeight = null;
                    currentAccordionPanel.setAttribute('aria-hidden', true);

                    setFocusableElements(currentAccordionPanel, false);
                }

                const initAccordion = (event) => {

                    event.preventDefault();
                    event.stopPropagation();
                    
                    for (const otherAccordionPanel of accordionPanelList) {

                        otherAccordionPanel.classList.remove('show');
                        
                        if (otherAccordionPanel !== currentAccordionPanel) {
                            otherAccordionPanel.classList.remove('shown');
                            otherAccordionPanel.style.maxHeight = null;
                            otherAccordionPanel.previousElementSibling.setAttribute('aria-expanded', false);
                            otherAccordionPanel.setAttribute('aria-hidden', true);

                            setFocusableElements(otherAccordionPanel, false);
                        }
                    }

                    currentAccordionPanel.classList.toggle('shown');

                    isExpanded = accordionButton.getAttribute('aria-expanded');
                    
                    if (isExpanded === 'true') {
                        accordionButton.setAttribute('aria-expanded', false);
                        currentAccordionPanel.setAttribute('aria-hidden', true);
                        
                        setFocusableElements(currentAccordionPanel, false);

                    } else if (isExpanded === 'false') {
                        accordionButton.setAttribute('aria-expanded', true);
                        currentAccordionPanel.setAttribute('aria-hidden', false);

                        setFocusableElements(currentAccordionPanel, true);
                    }

                    if (currentAccordionPanel.style.maxHeight) {
                        currentAccordionPanel.style.maxHeight = null;
                    } else {
                        currentAccordionPanel.style.maxHeight = currentAccordionPanel.scrollHeight + 'px';
                        currentAccordionPanel.setAttribute('aria-hidden', false);
                    }

                    let accTrigger = new Event('accTrigger', { bubbles: true });
                    document.dispatchEvent(accTrigger);

                }

                accordionButton.addEventListener('click', (event) => {
                    initAccordion(event);
                });

                accordionButton.addEventListener('keydown', (event) => {

                    const directionalFocus = (dir) => {
                        event.preventDefault();

                        let targetFocus = index + dir;

                        if (dir === -1 && targetFocus < 0) {
                            accordionButtonList[accordionButtonList.length -1].focus();
                        } else if (dir === 1 && targetFocus >= accordionButtonList.length) {
                            accordionButtonList[0].focus();
                        } else {
                            accordionButtonList[targetFocus].focus();
                        }
                    }

                    const key = event.keyCode;

                    const keyCodes = {
                        arrowUp: 38,
                        arrowDown: 40
                    };

                    switch (key) {
                        case keyCodes.arrowUp:
                            directionalFocus(-1);
                            break;
                        case keyCodes.arrowDown:
                            directionalFocus(1);
                            break;
                    }

                });

                accordionButton.addEventListener('keyup', (event) => {
                    if (event.keyCode === 13 && event.target.tagName !== 'BUTTON') {
                        initAccordion(event);
                    }
                });

            });

        });
    
    }
}
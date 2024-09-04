import { getFocusableElements } from './utilities/focus';

export default class Accordion {

    #accordionList = document.querySelectorAll('.accordion');

    setFocusableElements(element = document, focusable = false) {
        const focusableElementList = getFocusableElements(element);
        for (const focusableElement of focusableElementList) {
            if (focusable === true) {
                focusableElement.setAttribute('tabindex', 0);
            } else if (focusable === false) {
                focusableElement.setAttribute('tabindex', -1);
            }
        }
    }

    initAccordion(event, accordionButton, currentAccordionPanel, accordionPanelList) {
    
        event.preventDefault();
        event.stopPropagation();
        
        for (const otherAccordionPanel of accordionPanelList) {
            otherAccordionPanel.classList.remove('show');
            if (otherAccordionPanel !== currentAccordionPanel) {
                otherAccordionPanel.classList.remove('shown');
                otherAccordionPanel.previousElementSibling.setAttribute('aria-expanded', false);
                otherAccordionPanel.setAttribute('aria-hidden', true);
                this.setFocusableElements(otherAccordionPanel, false);
            }
        }

        currentAccordionPanel.classList.toggle('shown');
        let isExpanded = accordionButton.getAttribute('aria-expanded');
        
        if (isExpanded === 'true') {
            accordionButton.setAttribute('aria-expanded', false);
            currentAccordionPanel.setAttribute('aria-hidden', true);
            this.setFocusableElements(currentAccordionPanel, false);
        } else if (isExpanded === 'false') {
            accordionButton.setAttribute('aria-expanded', true);
            currentAccordionPanel.setAttribute('aria-hidden', false);
            this.setFocusableElements(currentAccordionPanel, true);
        }

        let accTrigger = new Event('accTrigger', { bubbles: true });
        document.dispatchEvent(accTrigger);
    }

    init() {
        this.#accordionList.forEach((accordion) => {
            const accordionButtonList = accordion.querySelectorAll(':scope > [data-accordion="button"]');
            const accordionPanelList = accordion.querySelectorAll(':scope > [data-accordion="panel"]');
            
            accordionButtonList.forEach((accordionButton, index) => {
                const currentAccordionPanel = accordionButton.nextElementSibling;
                let isExpanded = accordionButton.getAttribute('aria-expanded');

                accordionButton.setAttribute('tabindex', 0);
                if (isExpanded === 'true') {
                    currentAccordionPanel.classList.add('show');
                    this.setFocusableElements(currentAccordionPanel, true);
                } else {
                    accordionButton.setAttribute('aria-expanded', false);
                    currentAccordionPanel.setAttribute('aria-hidden', true);
                    this.setFocusableElements(currentAccordionPanel, false);
                }

                accordionButton.addEventListener('click', (event) => {
                    this.initAccordion(event, accordionButton, currentAccordionPanel, accordionPanelList);
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
                    switch (event.code) {
                        case 'ArrowUp':
                            directionalFocus(-1);
                            break;
                        case'ArrowDown':
                            directionalFocus(1);
                            break;
                        default:
                        // do nothing
                    }
                });

                accordionButton.addEventListener('keyup', (event) => {
                    if (event.code === 'Enter' && event.target.tagName !== 'BUTTON') {
                        this.initAccordion(event, accordionButton, currentAccordionPanel, accordionPanelList);
                    }
                });
            });
        });
    }
}
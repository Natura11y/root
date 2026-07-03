import { delegateEvent } from './utilities/eventDelegation';

export default class Accordion {

    #accordionList = document.querySelectorAll('.accordion');

    // Private method to handle accordion initialization (open/close)
    #initAccordion(event, accordionButton, currentAccordionPanel, accordionPanelList) {
        event.preventDefault();
        event.stopPropagation();

        // Close all other accordion panels
        accordionPanelList.forEach((otherPanel) => {
            if (otherPanel !== currentAccordionPanel) {
                otherPanel.classList.remove('shown');
                const prevSibling = otherPanel.previousElementSibling;
                const prevButton = prevSibling.querySelector('[data-accordion="button"]') ?? prevSibling;
                prevButton.setAttribute('aria-expanded', false);
                otherPanel.inert = true;
            }
        });

        // Toggle current accordion panel
        currentAccordionPanel.classList.toggle('shown');
        const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';

        accordionButton.setAttribute('aria-expanded', !isExpanded);
        currentAccordionPanel.inert = isExpanded;

        // Dispatch a custom event when accordion is toggled
        const accTrigger = new Event('accTrigger', { bubbles: true });
        document.dispatchEvent(accTrigger);
    }

    // Private method to handle key navigation
    #handleKeyNavigation(event, accordionButtonList, index) {
        const focusNext = (dir) => {
            event.preventDefault();
            let targetFocus = index + dir;

            if (dir === -1 && targetFocus < 0) {
                accordionButtonList[accordionButtonList.length - 1].focus();
            } else if (dir === 1 && targetFocus >= accordionButtonList.length) {
                accordionButtonList[0].focus();
            } else {
                accordionButtonList[targetFocus].focus();
            }
        };

        switch (event.code) {
            case 'ArrowUp':
                focusNext(-1);
                break;
            case 'ArrowDown':
                focusNext(1);
                break;
            default:
                break;
        }
    }

    // Public methods

    init() {

        this.#accordionList.forEach((accordion) => {
            const accordionButtonList = accordion.querySelectorAll(':scope > [data-accordion="button"], :scope > [data-accordion="heading"] > [data-accordion="button"]');
            const accordionPanelList = accordion.querySelectorAll(':scope > [data-accordion="panel"]');

            accordionButtonList.forEach((accordionButton) => {

                const currentAccordionPanel = accordionButton.closest('[data-accordion="heading"]')?.nextElementSibling ?? accordionButton.nextElementSibling;
                const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';

                accordionButton.setAttribute('tabindex', 0);
                currentAccordionPanel.classList.toggle('shown', isExpanded);
                currentAccordionPanel.inert = !isExpanded;

            });

            // Delegate events once per accordion container
            delegateEvent(accordion, 'click', '[data-accordion="button"]', (event) => {
                const clickedButton = event.target;
                const clickedPanel = clickedButton.closest('[data-accordion="heading"]')?.nextElementSibling ?? clickedButton.nextElementSibling;
                this.#initAccordion(event, clickedButton, clickedPanel, accordionPanelList);
            });

            delegateEvent(accordion, 'keydown', '[data-accordion="button"]', (event) => {
                const buttonIndex = Array.from(accordionButtonList).indexOf(event.target);
                this.#handleKeyNavigation(event, accordionButtonList, buttonIndex);
            });
        });
    
    }
}
import { getFocusableElements } from './utilities/focus';

export default class Collapse {

    // Private properties
    #collapseButtonList;

    constructor() {
        this.#collapseButtonList = document.querySelectorAll('[data-target-toggle]');
    }

    // Private methods
    #handleCollapseClose(button, target) {
        button.setAttribute('aria-expanded', false);
        target.classList.remove('shown');
    }

    #handleCollapseOpen(button, target, focusFirst) {
        button.setAttribute('aria-expanded', true);
        target.classList.add('shown');
        if (focusFirst) {
            focusFirst.focus();
        }
    }

    #handleKeyDown = (collapseButton, collapseTarget, firstFocusableElement) => {
        return (event) => {
            switch (event.code) {
                case 'Tab':
                    if (document.activeElement === firstFocusableElement && event.shiftKey) {
                        event.preventDefault();
                        collapseButton.focus();
                    }
                    break;
                case 'Escape':
                    this.#handleCollapseClose(collapseButton, collapseTarget);
                    break;
                default:
                // do nothing
            }
        };
    }

    #toggleCollapse = (collapseButton) => {
        return (event) => {
            const collapseTargetID = event.target.getAttribute('data-target-toggle').replace(/#/, '');
            const collapseTarget = document.getElementById(collapseTargetID);
            const focusableElements = getFocusableElements(collapseTarget);
            const firstFocusableElement = focusableElements[0];
            const isExpanded = collapseButton.getAttribute('aria-expanded');

            if (isExpanded === 'true') {
                this.#handleCollapseClose(collapseButton, collapseTarget);
            } else if (isExpanded === 'false') {
                this.#handleCollapseOpen(
                    collapseButton,
                    collapseTarget,
                    collapseTarget.hasAttribute('data-focus-first') ? firstFocusableElement : null
                );
            }

            return { collapseTarget, firstFocusableElement };
        };
    }

    // Public methods
    render() {
        this.#collapseButtonList.forEach((collapseButton) => {
            collapseButton.setAttribute('aria-expanded', false);

            collapseButton.addEventListener('click', this.#toggleCollapse(collapseButton));

            if (collapseButton.hasAttribute('data-target-close')) {

                const closeTargetID = collapseButton.getAttribute('data-target-close').replace(/#/, '');
                const closeTarget = document.getElementById(closeTargetID);

				const closeTargetButton = document.querySelector(`[data-target-toggle="#${closeTargetID}"]`);
				this.#handleCollapseClose(closeTargetButton, closeTarget);
            }
        });
    }
}
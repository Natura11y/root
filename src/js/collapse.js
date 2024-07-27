import { getFocusableElements, focusTrap } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class Collapse {

  // Private methods
  #handleCollapseClose = (button, target, focusButton = false) => {
    button.setAttribute('aria-expanded', 'false');
    target.classList.remove('shown');
    target.setAttribute('aria-hidden', 'true');

    if (focusButton) {
      button.focus();
    }
  };

  #handleCollapseOpen = (button, target, focusFirst = false) => {
    button.setAttribute('aria-expanded', 'true');
    target.classList.add('shown');
    target.setAttribute('aria-hidden', 'false');

    if (focusFirst) {
      focusFirst.focus();
    }

    // Trap focus within the collapsible target
    focusTrap(target);
  };

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
          this.#handleCollapseClose(collapseButton, collapseTarget, true);
          break;
        default:
          // do nothing
      }
    };
  };

  #toggleCollapse = (event) => {
    event.preventDefault();

    const collapseButton = event.target.closest('[data-toggle="collapse"]');
    if (!collapseButton) return;

    const collapseTargetID = collapseButton.getAttribute('aria-controls')?.replace(/#/, '');
    const collapseTarget = document.getElementById(collapseTargetID);
    if (!collapseTarget) return;

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

    collapseTarget.addEventListener(
      'keydown',
      this.#handleKeyDown(collapseButton, collapseTarget, firstFocusableElement)
    );

    if (collapseButton.hasAttribute('data-target-close')) {
      const closeTargetID = collapseButton.getAttribute('data-target-close')?.replace(/#/, '');
      const closeTarget = document.getElementById(closeTargetID);
      const closeTargetButton = document.querySelector(`[aria-controls="#${closeTargetID}"]`);

      if (closeTarget && closeTargetButton) {
        this.#handleCollapseClose(closeTargetButton, closeTarget);
      } else {
        console.error(`Could not find close target or close target button for ID ${closeTargetID}`);
      }
    }
  };

  // Public methods
  init = () => {
    document.querySelectorAll('[data-toggle="collapse"]').forEach((collapseButton) => {
      const collapseTargetID = collapseButton.getAttribute('aria-controls')?.replace(/#/, '');
      const collapseTarget = document.getElementById(collapseTargetID);
      if (!collapseTarget) return;

      collapseButton.setAttribute('aria-expanded', 'false');
      collapseTarget.setAttribute('aria-hidden', 'true');
    });

    delegateEvent(document, 'click', '[data-toggle="collapse"]', this.#toggleCollapse);
  };
}
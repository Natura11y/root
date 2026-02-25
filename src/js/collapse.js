import { getFocusableElements, focusTrap } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class Collapse {

  // Private properties

  #activeKeydownHandlers = new Map();

  #resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => {
      if (target.inert && target.offsetHeight > 0) {
        target.inert = false;
        this.#resizeObserver.unobserve(target);
      }
    });
  });

  // Private methods

  #handleCollapseClose(button, target, returnFocus = false) {
    button.setAttribute('aria-expanded', 'false');
    target.classList.remove('shown');
    target.inert = true;
    this.#resizeObserver.observe(target);
    if (returnFocus) button.focus();
  }

  #handleCollapseOpen(button, target, focusTarget = null) {
    button.setAttribute('aria-expanded', 'true');
    target.inert = false;
    this.#resizeObserver.unobserve(target);
    target.classList.add('shown');
    focusTrap(target);
    focusTarget?.focus();
  }

  #toggleCollapse = (event) => {
    event.preventDefault();

    const button = event.target.closest('[data-toggle="collapse"]');
    if (!button) return;

    const targetId = button.getAttribute('aria-controls')?.replace(/^#/, '');
    const target = document.getElementById(targetId);

    if (!target) {
      console.error(`Collapse target "${targetId}" not found.`);
      return;
    }

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const [firstFocusable] = getFocusableElements(target);

    if (isExpanded) {
      this.#handleCollapseClose(button, target);
    } else {
      this.#handleCollapseOpen(button, target, target.hasAttribute('data-focus-first') ? firstFocusable : null);
    }

    const prev = this.#activeKeydownHandlers.get(target);
    if (prev) target.removeEventListener('keydown', prev);

    const handler = (e) => {
      if (e.code === 'Escape') {
        this.#handleCollapseClose(button, target, true);
      } else if (e.code === 'Tab' && e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        button.focus();
      }
    };

    target.addEventListener('keydown', handler);
    this.#activeKeydownHandlers.set(target, handler);

    target.addEventListener('transitionend', () => {
      if (!target.classList.contains('shown')) {
        target.removeEventListener('keydown', handler);
        this.#activeKeydownHandlers.delete(target);
      }
    }, { once: true });

    if (button.hasAttribute('data-target-close')) {
      const closeId = button.getAttribute('data-target-close')?.replace(/^#/, '');
      const closeTarget = document.getElementById(closeId);
      const closeButton = document.querySelector(`[aria-controls="${closeId}"]`);
      if (closeTarget && closeButton) {
        this.#handleCollapseClose(closeButton, closeTarget);
      } else {
        console.error(`Close target "${closeId}" not found.`);
      }
    }
  };

  // Public methods

  init = () => {
    document.querySelectorAll('.collapse:not(.shown)').forEach((el) => {
      el.inert = true;
    });
    
    delegateEvent(document, 'click', '[data-toggle="collapse"]', this.#toggleCollapse);
  };
}

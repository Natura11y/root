import { getFocusableElements } from './utilities/focus';
import { delegateEvent } from './utilities/eventDelegation';

export default class Collapse {

  // Private properties

  #activeKeydownHandlers = new Map();
  #fallbackTabTargets = new Set();

  #resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => {
      if (getComputedStyle(target).visibility === 'visible') {
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

    if (this.#fallbackTabTargets.has(target)) {
      target.removeAttribute('tabindex');
      this.#fallbackTabTargets.delete(target);
    }

    if (returnFocus) button.focus();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanup = () => {
      target.removeAttribute('data-active');
      const handler = this.#activeKeydownHandlers.get(target);
      if (handler) {
        target.removeEventListener('keydown', handler);
        this.#activeKeydownHandlers.delete(target);
      }
      this.#resizeObserver.observe(target);
    };

    if (reducedMotion) {
      cleanup();
    } else {
      target.addEventListener('transitionend', (e) => {
        if (e.target !== target || !['height', 'grid-template-rows'].includes(e.propertyName)) return;
        cleanup();
      }, { once: true });
    }
  }

  #handleCollapseOpen(button, target, focusMode = null) {
    button.setAttribute('aria-expanded', 'true');
    target.setAttribute('data-active', '');
    target.inert = false;
    this.#resizeObserver.unobserve(target);
    target.classList.add('shown');

    if (focusMode === 'first') {
      const [firstFocusable] = getFocusableElements(target);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        target.tabIndex = -1;
        this.#fallbackTabTargets.add(target);
        target.focus();
      }
    } else if (focusMode === 'panel') {
      target.tabIndex = -1;
      this.#fallbackTabTargets.add(target);
      target.focus();
    }
  }

  #toggleCollapse = (event) => {
    const button = event.target.closest('[data-toggle="collapse"]');
    if (!button) return;

    event.preventDefault();

    const targetId = button.getAttribute('aria-controls')?.replace(/^#/, '');
    const target = document.getElementById(targetId);

    if (!target) {
      console.error(`Collapse target "${targetId}" not found.`);
      return;
    }

    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
      this.#handleCollapseClose(button, target);
    } else {
      const focusMode = target.hasAttribute('data-focus-first') ? 'first'
                      : event.detail === 0 ? 'panel'
                      : null;
      this.#handleCollapseOpen(button, target, focusMode);
    }

    const prev = this.#activeKeydownHandlers.get(target);
    if (prev) target.removeEventListener('keydown', prev);

    const handler = (e) => {
      if (e.code === 'Escape') {
        this.#handleCollapseClose(button, target, true);
      }
    };

    target.addEventListener('keydown', handler);
    this.#activeKeydownHandlers.set(target, handler);

    if (!isExpanded && button.hasAttribute('data-target-close')) {
      const closeId = button.getAttribute('data-target-close')?.replace(/^#/, '');
      const closeTarget = document.getElementById(closeId);
      const closeButton = document.querySelector(`[aria-controls="${closeId}"]`);
      if (closeTarget && closeButton) {
        if (closeButton.getAttribute('aria-expanded') === 'true') {
          this.#handleCollapseClose(closeButton, closeTarget);
        }
      } else {
        console.error(`Close target "${closeId}" not found.`);
      }
    }
  };

  // Public methods

  init = () => {
    document.querySelectorAll('.collapse:not(.shown)').forEach((el) => {
      if (getComputedStyle(el).visibility !== 'visible') {
        el.inert = true;
      }
      this.#resizeObserver.observe(el);
    });
    delegateEvent(document, 'click', '[data-toggle="collapse"]', this.#toggleCollapse);
  };
}

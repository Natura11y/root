import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { delegateEvent } from './utilities/eventDelegation';
import { getCurrentBreakpoint } from './utilities/getCurrentBreakpoint';

export default class Navigation {
  
  // Private properties
  
  #isAnyDropdownOpen = false;
  #hoverTimeout = 400;

  // Private methods

  #openDropdown(dropdownButton, dropdownMenu) {
  
    this.#isAnyDropdownOpen = true;

    dropdownButton.setAttribute('aria-expanded', 'true');
    dropdownMenu.classList.add('shown');

    if (dropdownMenu.classList.contains('mega-menu')) {
      handleOverlayOpen();
    }
  }

  #closeDropdown(dropdownButton, dropdownMenu) {
    
    this.#isAnyDropdownOpen = this.#checkAnyDropdownOpen();
    dropdownMenu.classList.remove('shown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    if (dropdownMenu.classList.contains('mega-menu')) {
      handleOverlayClose();
    }
  }

  #checkAnyDropdownOpen() {
    return Array.from(document.querySelectorAll('[data-toggle="dropdown"]')).some((button) => {
      const dropdownMenu = document.getElementById(button.getAttribute('aria-controls'));
      return dropdownMenu && dropdownMenu.classList.contains('shown');
    });
  }

  #handleWindowClick = (event) => {
    if (!this.#isAnyDropdownOpen) return;

    document.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
      const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));

      if (
        dropdownMenu &&
        dropdownMenu.classList.contains('shown') &&
        !dropdownMenu.contains(event.target) &&
        !dropdownButton.contains(event.target)
      ) {
        this.#closeDropdown(dropdownButton, dropdownMenu);
      }
    });
  };

  #handleEscapeKeyPress = (event) => {
    if (event.key === 'Escape' && this.#isAnyDropdownOpen) {
      document.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
        const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));

        if (dropdownMenu.classList.contains('shown')) {
          this.#closeDropdown(dropdownButton, dropdownMenu);
          dropdownButton.focus();
        }
      });

      this.#isAnyDropdownOpen = false;
    }
  };

  #handleButtonMenuFocusout = (dropdownButton, dropdownMenu) => (event) => {
    
    const computedStyle = window.getComputedStyle(dropdownMenu);
    if (computedStyle.position !== 'absolute') return;
    
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget &&
      !dropdownMenu.contains(relatedTarget) &&
      !dropdownButton.contains(relatedTarget)
    ) {
      this.#closeDropdown(dropdownButton, dropdownMenu);
    }
  };

  #cleanupEventListeners(dropdownButton, dropdownMenu) {
    const splitItem = dropdownButton.closest('.nav__item--split');
    const hoverTarget = splitItem || dropdownButton;
    
    if (hoverTarget._hoverInHandler) {
      hoverTarget.removeEventListener('mouseenter', hoverTarget._hoverInHandler);
      delete hoverTarget._hoverInHandler;
    }
    if (dropdownMenu._hoverInHandler) {
      dropdownMenu.removeEventListener('mouseenter', dropdownMenu._hoverInHandler);
      delete dropdownMenu._hoverInHandler;
    }
    if (hoverTarget._hoverOutHandler) {
      hoverTarget.removeEventListener('mouseleave', hoverTarget._hoverOutHandler);
      delete hoverTarget._hoverOutHandler;
    }
    if (dropdownMenu._hoverOutHandler) {
      dropdownMenu.removeEventListener('mouseleave', dropdownMenu._hoverOutHandler);
      delete dropdownMenu._hoverOutHandler;
    }
    if (dropdownButton._hoverObserver) {
      dropdownButton._hoverObserver.disconnect();
      delete dropdownButton._hoverObserver;
    }
    dropdownButton._hasHoverListeners = false;
  }

  // Public methods

  init() {
    
    delegateEvent(document, 'click', '[data-toggle="dropdown"]', (event) => {
      const dropdownButton = event.target;
      const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
      const dropdownMenu = document.getElementById(dropdownMenuId);

      if (!dropdownMenu) {
        console.warn(`No dropdown menu found for ${dropdownMenuId}`);
        return;
      }

      const isShown = dropdownMenu.classList.contains('shown');

      isShown
        ? this.#closeDropdown(dropdownButton, dropdownMenu)
        : this.#openDropdown(dropdownButton, dropdownMenu);
    });

    // Helper to manage hover event listeners
    const addHoverListeners = () => {
      document.querySelectorAll('[data-toggle="dropdown"][data-hover="true"]').forEach((dropdownButton) => {
        // Prevent duplicate listeners
        if (dropdownButton._hasHoverListeners) return;
        dropdownButton._hasHoverListeners = true;

        const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
        const dropdownMenu = document.getElementById(dropdownMenuId);
        if (!dropdownMenu) return;

        let openedByKeyboardOrClick = false;
        dropdownButton.addEventListener('click', () => {
          openedByKeyboardOrClick = true;
        });
        dropdownButton.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            openedByKeyboardOrClick = true;
          }
        });
        dropdownMenu.addEventListener('keydown', () => {
          openedByKeyboardOrClick = true;
        });

        // Hover in - check if this is a split item
        const splitItem = dropdownButton.closest('.nav__item--split');
        const hoverTarget = splitItem || dropdownButton;
        
        hoverTarget.addEventListener('mouseenter', hoverTarget._hoverInHandler = () => {
          if (!openedByKeyboardOrClick) {
            this.#openDropdown(dropdownButton, dropdownMenu);
          }
        });
        dropdownMenu.addEventListener('mouseenter', dropdownMenu._hoverInHandler = () => {
          if (!openedByKeyboardOrClick) {
            this.#openDropdown(dropdownButton, dropdownMenu);
          }
        });
        // Hover out
        const hoverOutHandler = () => {
          setTimeout(() => {
            const hoverCheck = splitItem ? 
              !splitItem.matches(':hover') && !dropdownMenu.matches(':hover') :
              !dropdownButton.matches(':hover') && !dropdownMenu.matches(':hover');
              
            if (hoverCheck && !openedByKeyboardOrClick) {
              this.#closeDropdown(dropdownButton, dropdownMenu);
              openedByKeyboardOrClick = false;
            }
          }, this.#hoverTimeout);
        };
        hoverTarget.addEventListener('mouseleave', hoverTarget._hoverOutHandler = hoverOutHandler);
        dropdownMenu.addEventListener('mouseleave', dropdownMenu._hoverOutHandler = hoverOutHandler);

        // Also reset the flag when closed by other means
        const observer = new MutationObserver(() => {
          if (!dropdownMenu.classList.contains('shown')) {
            openedByKeyboardOrClick = false;
          }
        });
        observer.observe(dropdownMenu, { attributes: true, attributeFilter: ['class'] });
        dropdownButton._hoverObserver = observer;
      });
    };

    const removeHoverListeners = () => {
      document.querySelectorAll('[data-toggle="dropdown"][data-hover="true"]').forEach((dropdownButton) => {
        if (!dropdownButton._hasHoverListeners) return;
        const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
        const dropdownMenu = document.getElementById(dropdownMenuId);
        if (!dropdownMenu) return;
        this.#cleanupEventListeners(dropdownButton, dropdownMenu);
      });
    };

    // Responsive hover logic
    const setupResponsiveHover = () => {
      if (
        window.matchMedia &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        getCurrentBreakpoint().isDesktop
      ) {
        addHoverListeners();
      } else {
        removeHoverListeners();
      }
    };

    setupResponsiveHover();
    window.addEventListener('resize', setupResponsiveHover);

    // Delegate focusout for focus handling on dropdowns
    document.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
      const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
      const dropdownMenu = document.getElementById(dropdownMenuId);

      if (!dropdownMenu) return;

      const focusOutHandler = this.#handleButtonMenuFocusout(dropdownButton, dropdownMenu);
      dropdownButton.addEventListener('focusout', focusOutHandler);
      dropdownMenu.addEventListener('focusout', focusOutHandler);
    });

    window.addEventListener('click', this.#handleWindowClick);
    document.addEventListener('keydown', this.#handleEscapeKeyPress);
  }
}
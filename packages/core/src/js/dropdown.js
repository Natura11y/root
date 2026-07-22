import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { delegateEvent } from './utilities/eventDelegation';
import { getCurrentBreakpoint } from './utilities/getCurrentBreakpoint';

export default class Dropdown {

  // Private properties

  #isAnyDropdownOpen = false;
  #hoverTimeout = 400;

  // Private methods

  #isMegaMenu(element) {
    return [...element.classList].some(cls => cls.startsWith('mega-menu'));
  }

  #isBreakpointAtLeast(requiredBp) {
    const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'];
    const currentBp = getCurrentBreakpoint().value;
    const currentIndex = breakpoints.indexOf(currentBp);
    const requiredIndex = breakpoints.indexOf(requiredBp);
    if (requiredIndex === -1) return true;
    return currentIndex !== -1 && currentIndex >= requiredIndex;
  }

  #isAtBreakpoint(dropdownMenu) {
    const megaMenuClass = [...dropdownMenu.classList].find(cls => cls.startsWith('mega-menu--'));
    if (!megaMenuClass) return true;
    return this.#isBreakpointAtLeast(megaMenuClass.split('--')[1]);
  }

  #openDropdown(dropdownButton, dropdownMenu) {

    this.#isAnyDropdownOpen = true;

    dropdownButton.setAttribute('aria-expanded', 'true');
    dropdownMenu.classList.add('shown');

    if (this.#isMegaMenu(dropdownMenu) && this.#isAtBreakpoint(dropdownMenu)) {
      handleOverlayOpen();
    }

  }

  #closeDropdown(dropdownButton, dropdownMenu) {

    this.#isAnyDropdownOpen = this.#checkAnyDropdownOpen();
    dropdownMenu.classList.remove('shown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    if (this.#isMegaMenu(dropdownMenu) && this.#isAtBreakpoint(dropdownMenu)) {
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

      if (dropdownMenu && dropdownMenu.classList.contains('shown')) {
        // Check if click is inside dropdown menu
        if (dropdownMenu.contains(event.target)) {
          return;
        }

        // For dropdown-link-split, check the entire wrapper
        const linkDropdownItem = dropdownButton.closest('.dropdown-link-split');
        const clickTarget = linkDropdownItem || dropdownButton;

        // If click is outside the entire component, close dropdown
        if (!clickTarget.contains(event.target)) {
          this.#closeDropdown(dropdownButton, dropdownMenu);
        }

      }
    });
  };

  #handleEscapeKeyPress = (event) => {
    if (event.key === 'Escape' && this.#isAnyDropdownOpen) {
      document.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
        const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));

        if (!dropdownMenu) return;

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

    const linkDropdownItem = dropdownButton.closest('.dropdown-link-split');
    const hoverTarget = linkDropdownItem || dropdownButton;

    if (dropdownButton._clickFlagHandler) {
      dropdownButton.removeEventListener('click', dropdownButton._clickFlagHandler);
      delete dropdownButton._clickFlagHandler;
    }

    if (dropdownButton._keyFlagHandler) {
      dropdownButton.removeEventListener('keydown', dropdownButton._keyFlagHandler);
      delete dropdownButton._keyFlagHandler;
    }

    if (dropdownMenu._menuKeyFlagHandler) {
      dropdownMenu.removeEventListener('keydown', dropdownMenu._menuKeyFlagHandler);
      delete dropdownMenu._menuKeyFlagHandler;
    }

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

      const dropdownButton = event.target.closest('[data-toggle="dropdown"]');

      if (!dropdownButton) return;

      const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
      const dropdownMenu = document.getElementById(dropdownMenuId);

      if (!dropdownMenu) {
        console.warn(`No dropdown menu found for ${dropdownMenuId}`);
        return;
      }

      if (dropdownButton._hasHoverListeners && event.detail > 0) return;

      const isShown = dropdownMenu.classList.contains('shown');

      isShown
        ? this.#closeDropdown(dropdownButton, dropdownMenu)
        : this.#openDropdown(dropdownButton, dropdownMenu);

    });

    // Helper to manage hover event listeners
    const addHoverListeners = () => {

      // Target both data-hover="true" and dropdown-link-split buttons
      const hoverButtons = document.querySelectorAll('[data-toggle="dropdown"][data-hover="true"], .dropdown-link-split [data-toggle="dropdown"]');

      hoverButtons.forEach((dropdownButton) => {

        // Prevent duplicate listeners
        if (dropdownButton._hasHoverListeners) return;
        dropdownButton._hasHoverListeners = true;

        const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
        const dropdownMenu = document.getElementById(dropdownMenuId);

        if (!dropdownMenu) return;

        let openedByKeyboardOrClick = false;

        dropdownButton._clickFlagHandler = (e) => {
          if (dropdownButton._hasHoverListeners && e.detail > 0) return;
          openedByKeyboardOrClick = true;
        };
        dropdownButton.addEventListener('click', dropdownButton._clickFlagHandler);

        dropdownButton._keyFlagHandler = (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            openedByKeyboardOrClick = true;
          }
        };
        dropdownButton.addEventListener('keydown', dropdownButton._keyFlagHandler);

        dropdownMenu._menuKeyFlagHandler = () => {
          openedByKeyboardOrClick = true;
        };
        dropdownMenu.addEventListener('keydown', dropdownMenu._menuKeyFlagHandler);

        // Hover in - check if this is a dropdown-link-split item
        const linkDropdownItem = dropdownButton.closest('.dropdown-link-split');
        const hoverTarget = linkDropdownItem || dropdownButton;

        hoverTarget.addEventListener('mouseenter', hoverTarget._hoverInHandler = () => {
          if (!openedByKeyboardOrClick) {
            // Close any other open dropdowns immediately to prevent multiple menus showing
            document.querySelectorAll('[data-toggle="dropdown"][aria-expanded="true"]').forEach((otherButton) => {
              if (otherButton !== dropdownButton) {
                const otherMenuId = otherButton.getAttribute('aria-controls');
                const otherMenu = document.getElementById(otherMenuId);
                if (otherMenu) {
                  this.#closeDropdown(otherButton, otherMenu);
                }
              }
            });

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
            const hoverCheck = linkDropdownItem ?
              !linkDropdownItem.matches(':hover') && !dropdownMenu.matches(':hover') :
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

      // Target both data-hover="true" and dropdown-link-split buttons
      const hoverButtons = document.querySelectorAll('[data-toggle="dropdown"][data-hover="true"], .dropdown-link-split [data-toggle="dropdown"]');

      hoverButtons.forEach((dropdownButton) => {
        if (!dropdownButton._hasHoverListeners) return;
        const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
        const dropdownMenu = document.getElementById(dropdownMenuId);
        if (!dropdownMenu) return;
        this.#cleanupEventListeners(dropdownButton, dropdownMenu);
      });

    };

    // Responsive hover logic
    const setupResponsiveHover = () => {

      const hoverDropdownAtBreakpoint = document.querySelector('[data-toggle="dropdown"][data-hover="true"]') &&
        getCurrentBreakpoint().isDesktop;

      const linkSplitAtBreakpoint = document.querySelector('.dropdown-link-split [data-toggle="dropdown"]') &&
        getCurrentBreakpoint().isDesktop;

      // Check if any mega menu is at its required breakpoint
      const megaMenuAtBreakpoint = Array.from(document.querySelectorAll('[class*="mega-menu--"]')).some(menu =>
        this.#isAtBreakpoint(menu)
      );

      // Check if the main menu is at its required breakpoint
      const mainMenuEl = document.querySelector('[class*="main-menu--"]');
      const mainMenuBpClass = mainMenuEl && [...mainMenuEl.classList].find(cls => cls.startsWith('main-menu--'));
      const mainMenuAtBreakpoint = mainMenuBpClass ? this.#isBreakpointAtLeast(mainMenuBpClass.split('--').pop()) : false;

      const shouldEnableHover = hoverDropdownAtBreakpoint || linkSplitAtBreakpoint || megaMenuAtBreakpoint || mainMenuAtBreakpoint;

      if (
        window.matchMedia &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        shouldEnableHover
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

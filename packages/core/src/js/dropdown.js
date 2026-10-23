import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';
import { getCurrentBreakpoint } from './utilities/getCurrentBreakpoint';

export default class Dropdown {

  // Private properties

  static #initializedRoots = new WeakMap();

  #root = null;
  #initializedDropdowns = new Map();
  #resizeHandler = null;
  #overlayMenu = null;
  #isAnyDropdownOpen = false;
  #hoverTimeout = 400;

  // Private methods

  #getDropdownMenu(button) {
    const id = button.getAttribute('aria-controls');
    return id ? this.#root.querySelector(`#${CSS.escape(id)}`) : null;
  }

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
      this.#overlayMenu = dropdownMenu;
    }

  }

  #closeDropdown(dropdownButton, dropdownMenu) {

    this.#isAnyDropdownOpen = this.#checkAnyDropdownOpen();
    dropdownMenu.classList.remove('shown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    if (this.#overlayMenu === dropdownMenu) {
      handleOverlayClose();
      this.#overlayMenu = null;
    }

  }

  #checkAnyDropdownOpen() {
    return Array.from(this.#root.querySelectorAll('[data-toggle="dropdown"]')).some((button) => {
      const dropdownMenu = this.#getDropdownMenu(button);
      return dropdownMenu && dropdownMenu.classList.contains('shown');
    });
  }

  #handleClick = (event) => {

    const dropdownButton = event.target.closest('[data-toggle="dropdown"]');

    if (!dropdownButton || !this.#root.contains(dropdownButton)) return;

    const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
    const dropdownMenu = this.#getDropdownMenu(dropdownButton);

    if (!dropdownMenu) {
      console.warn(`No dropdown menu found for ${dropdownMenuId}`);
      return;
    }

    if (dropdownButton._hasHoverListeners && event.detail > 0) return;

    const isShown = dropdownMenu.classList.contains('shown');

    isShown
      ? this.#closeDropdown(dropdownButton, dropdownMenu)
      : this.#openDropdown(dropdownButton, dropdownMenu);

  };

  #handleWindowClick = (event) => {
    if (!this.#isAnyDropdownOpen) return;

    this.#root.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
      const dropdownMenu = this.#getDropdownMenu(dropdownButton);

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
      this.#root.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
        const dropdownMenu = this.#getDropdownMenu(dropdownButton);

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

    clearTimeout(dropdownButton._hoverTimeout);
    delete dropdownButton._hoverTimeout;

    const linkDropdownItem = dropdownButton.closest('.dropdown-link-split');
    const hoverTarget = dropdownButton._hoverTarget || linkDropdownItem || dropdownButton;

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

    delete dropdownButton._hoverTarget;
    dropdownButton._hasHoverListeners = false;
  }

  #cleanupDropdown(button, { menu, focusOutHandler }) {
    this.#cleanupEventListeners(button, menu);
    button.removeEventListener('focusout', focusOutHandler);
    menu.removeEventListener('focusout', focusOutHandler);

    if (menu.classList.contains('shown')) this.#closeDropdown(button, menu);
    this.#initializedDropdowns.delete(button);
  }

  // Public methods

  init(root = document) {

    const owner = Dropdown.#initializedRoots.get(root);
    if (owner && owner !== this) return owner.init(root);

    if (this.#root && this.#root !== root) this.destroy();
    this.#root = root;

    this.#initializedDropdowns.forEach((entry, button) => {
      if (!root.contains(button) || this.#getDropdownMenu(button) !== entry.menu) {
        this.#cleanupDropdown(button, entry);
      }
    });

    // Helper to manage hover event listeners
    const addHoverListeners = () => {

      // Target both data-hover="true" and dropdown-link-split buttons
      const hoverButtons = this.#root.querySelectorAll('[data-toggle="dropdown"][data-hover="true"], .dropdown-link-split [data-toggle="dropdown"]');

      hoverButtons.forEach((dropdownButton) => {

        // Prevent duplicate listeners
        if (dropdownButton._hasHoverListeners) return;

        const dropdownMenu = this.#getDropdownMenu(dropdownButton);
        if (!dropdownMenu) return;

        dropdownButton._hasHoverListeners = true;

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
        dropdownButton._hoverTarget = hoverTarget;

        hoverTarget.addEventListener('mouseenter', hoverTarget._hoverInHandler = () => {
          if (!openedByKeyboardOrClick) {
            // Close any other open dropdowns immediately to prevent multiple menus showing
            this.#root.querySelectorAll('[data-toggle="dropdown"][aria-expanded="true"]').forEach((otherButton) => {
              if (otherButton !== dropdownButton) {
                const otherMenu = this.#getDropdownMenu(otherButton);
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
          clearTimeout(dropdownButton._hoverTimeout);
          dropdownButton._hoverTimeout = setTimeout(() => {
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
      const hoverButtons = this.#root.querySelectorAll('[data-toggle="dropdown"][data-hover="true"], .dropdown-link-split [data-toggle="dropdown"]');

      hoverButtons.forEach((dropdownButton) => {
        if (!dropdownButton._hasHoverListeners) return;
        const dropdownMenu = this.#getDropdownMenu(dropdownButton);
        if (!dropdownMenu) return;
        this.#cleanupEventListeners(dropdownButton, dropdownMenu);
      });

    };

    // Responsive hover logic
    const setupResponsiveHover = () => {

      // Attach focus handling once per dropdown button
      this.#root.querySelectorAll('[data-toggle="dropdown"]').forEach((dropdownButton) => {
        if (this.#initializedDropdowns.has(dropdownButton)) return;

        const dropdownMenu = this.#getDropdownMenu(dropdownButton);

        if (!dropdownMenu) return;

        const focusOutHandler = this.#handleButtonMenuFocusout(dropdownButton, dropdownMenu);
        dropdownButton.addEventListener('focusout', focusOutHandler);
        dropdownMenu.addEventListener('focusout', focusOutHandler);
        this.#initializedDropdowns.set(dropdownButton, { menu: dropdownMenu, focusOutHandler });
      });

      const hoverDropdownAtBreakpoint = this.#root.querySelector('[data-toggle="dropdown"][data-hover="true"]') &&
        getCurrentBreakpoint().isDesktop;

      const linkSplitAtBreakpoint = this.#root.querySelector('.dropdown-link-split [data-toggle="dropdown"]') &&
        getCurrentBreakpoint().isDesktop;

      // Check if any mega menu is at its required breakpoint
      const megaMenuAtBreakpoint = Array.from(this.#root.querySelectorAll('[class*="mega-menu--"]')).some(menu =>
        this.#isAtBreakpoint(menu)
      );

      // Check if the main menu is at its required breakpoint
      const mainMenuEl = this.#root.querySelector('[class*="main-menu--"]');
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


    if (!owner) {
      this.#resizeHandler = setupResponsiveHover;
      root.addEventListener('click', this.#handleClick);
      window.addEventListener('resize', this.#resizeHandler);
      window.addEventListener('click', this.#handleWindowClick);
      document.addEventListener('keydown', this.#handleEscapeKeyPress);
      Dropdown.#initializedRoots.set(root, this);
    }

    return this;

  }

  destroy() {
    if (!this.#root) return;

    this.#root.removeEventListener('click', this.#handleClick);
    window.removeEventListener('resize', this.#resizeHandler);
    window.removeEventListener('click', this.#handleWindowClick);
    document.removeEventListener('keydown', this.#handleEscapeKeyPress);

    this.#initializedDropdowns.forEach((entry, button) => this.#cleanupDropdown(button, entry));
    Dropdown.#initializedRoots.delete(this.#root);

    this.#root = null;
    this.#resizeHandler = null;
    this.#isAnyDropdownOpen = false;
  }

}
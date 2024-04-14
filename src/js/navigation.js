import { getFocusableElements } from './utilities/focus';
import { focusTrap } from './utilities/focus';

import { handleMenuOpen } from './utilities/overlay';

export default class Navigation {

    // Private properties
    #dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');
    #isAnyDropdownOpen = false;

    // Private methods
    
    #openDropdown(dropdownButton, dropdownMenu) {
        this.#isAnyDropdownOpen = true;
        dropdownMenu.classList.add('shown');
        dropdownButton.setAttribute('aria-expanded', 'true');
        if (dropdownMenu.classList.contains('primary-nav__mega-menu')) {
            handleMenuOpen(dropdownMenu);
        }
    }

    #closeDropdown(dropdownButton, dropdownMenu) {
        this.#isAnyDropdownOpen = this.#checkAnyDropdownOpen();
        dropdownMenu.classList.remove('shown');
        dropdownButton.setAttribute('aria-expanded', 'false');
    }

    #setupListeners(dropdownButton, dropdownMenu) {

        let delayClose;

        const handleHoverFocusOpen = () => {
            clearTimeout(delayClose);
            this.#openDropdown(dropdownButton, dropdownMenu);

        };

        const handleHoverFocusClose = () => {
            delayClose = setTimeout(() => {
                this.#closeDropdown(dropdownButton, dropdownMenu);
            }, 250);
        };
        
        const handleFocusout = () => {
            delayClose = setTimeout(() => {
                if (!dropdownMenu.contains(document.activeElement) && !dropdownButton.contains(document.activeElement)) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            }, 10);
        };
        
        if (dropdownButton.dataset.trigger === 'hover') {
            dropdownButton.addEventListener('mouseenter', handleHoverFocusOpen);
            dropdownButton.addEventListener('focus', handleHoverFocusOpen);
            dropdownButton.addEventListener('mouseleave', handleHoverFocusClose);

            dropdownMenu.addEventListener('mouseenter', () => clearTimeout(delayClose));
            dropdownMenu.addEventListener('mouseleave', handleHoverFocusClose);
        }

        else {
            dropdownButton.addEventListener('click', (event) => {
                event.preventDefault();
                const isShown = dropdownMenu.classList.contains('shown');

                isShown ? 
                    this.#closeDropdown(dropdownButton, dropdownMenu) : 
                    this.#openDropdown(dropdownButton, dropdownMenu);
            });
        }

        dropdownButton.addEventListener('focusout', handleFocusout);
        dropdownMenu.addEventListener('focusout', handleFocusout);
    }

    #handleWindowClick = (event) => {
        if (!this.#isAnyDropdownOpen) return;

        this.#dropdownButtonList.forEach((dropdownButton) => {
            const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));
            if (dropdownMenu && !dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
                this.#closeDropdown(dropdownButton, dropdownMenu);
            }
        });
    };

    #checkAnyDropdownOpen() {
        return Array.from(this.#dropdownButtonList).some(button => {
            const menu = document.getElementById(button.getAttribute('aria-controls'));
            return menu.classList.contains('shown');
        });
    }

    // Public methods

    init() {
    
        this.#dropdownButtonList.forEach((dropdownButton) => {
            const dropdownMenuId = dropdownButton.getAttribute('aria-controls');
            const dropdownMenu = document.getElementById(dropdownMenuId);

            if (!dropdownMenu) {
                console.warn(`No dropdown menu found for ${dropdownMenuId}`);
                return;
            }

            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.setAttribute('aria-haspopup', 'true');
            
            this.#setupListeners(dropdownButton, dropdownMenu);
        });

        window.addEventListener('click', this.#handleWindowClick);
    }
}
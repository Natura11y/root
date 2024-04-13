import { getFocusableElements } from './utilities/focus';

export default class Navigation {

    // Private properties
    #dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');

    // Private methods
    
    #openDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.add('shown');
        dropdownButton.setAttribute('aria-expanded', 'true');
    }

    #closeDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.remove('shown');
        dropdownButton.setAttribute('aria-expanded', 'false');
    }

    #setupListeners(dropdownButton, dropdownMenu) {
        let delayClose;

        const handleDropdownOpen = () => {
            clearTimeout(delayClose);
            this.#openDropdown(dropdownButton, dropdownMenu);
        };

        const handleDropdownClose = () => {
            delayClose = setTimeout(() => this.#closeDropdown(dropdownButton, dropdownMenu), 300);
        };
        
        const handleFocusout = () => {
            delayClose = setTimeout(() => {
                if (!dropdownMenu.contains(document.activeElement) && !dropdownButton.contains(document.activeElement)) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            }, 10);
        };
        
        if (dropdownButton.dataset.trigger === 'hover') {
            dropdownButton.addEventListener('mouseenter', handleDropdownOpen);
            dropdownButton.addEventListener('mouseleave', handleDropdownClose);
            dropdownMenu.addEventListener('mouseenter', () => clearTimeout(delayClose));
            dropdownMenu.addEventListener('mouseleave', handleDropdownClose);

            // Ensure dropdown stays open when focused (accessibility enhancement)
            dropdownButton.addEventListener('focus', handleDropdownOpen);
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

        window.addEventListener('click', (event) => {
            this.#dropdownButtonList.forEach((dropdownButton) => {
                const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));
                if (dropdownMenu && !dropdownMenu.contains(event.target) && !dropdownButton.contains(event.target)) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.#dropdownButtonList.forEach((dropdownButton) => {
                    const dropdownMenu = document.getElementById(dropdownButton.getAttribute('aria-controls'));
                    
                    if (dropdownButton.getAttribute('aria-expanded') === 'true' && dropdownButton.dataset.trigger !== 'hover') {
                        this.#closeDropdown(dropdownButton, dropdownMenu);
                        dropdownButton.focus();
                    }
                });
            }
        });
    }

}
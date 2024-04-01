import { getFocusableElements } from './utilities/focus';

export default class Navigation {

    // Private properties
    
    #dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');

    // Private methods

    #toggleDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.toggle('shown');
        dropdownButton.setAttribute('aria-expanded', dropdownButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    }

    #closeDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.remove('shown');
        dropdownButton.setAttribute('aria-expanded', 'false');
    }

    // Public methods

    init() {

        window.addEventListener('click', (event) => {
            this.#dropdownButtonList.forEach((dropdownButton) => {
                let dropdownButtonParent = dropdownButton.closest('li');
                let dropdownMenu = dropdownButton.nextElementSibling;

                let dropdownButtonClick = dropdownButtonParent.contains(event.target);

                if (!dropdownButtonClick) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.#dropdownButtonList.forEach((dropdownButton) => {
                    if (dropdownButton.getAttribute('aria-expanded') === 'true') {
                        let dropdownMenu = dropdownButton.nextElementSibling;
                        this.#closeDropdown(dropdownButton, dropdownMenu);
                        dropdownButton.focus();
                    }
                });
            }
        });

        this.#dropdownButtonList.forEach((dropdownButton) => {
        
            let dropdownMenu = dropdownButton.nextElementSibling;

            if (!dropdownMenu) {
                console.warn(`No dropdown menu found for dropdown button ${dropdownButton}`);
                return;
            }

            let existingAriaControls = dropdownButton.getAttribute('aria-controls');

            if (!existingAriaControls) {
            
                if (!dropdownMenu.id) {
                    dropdownMenu.id = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
                }
                
                dropdownButton.setAttribute('aria-controls', dropdownMenu.id);
            } else {
                if (!document.getElementById(existingAriaControls)) {
                    console.warn(`The element with ID '${existingAriaControls}' specified by aria-controls on the button does not exist.`);
                }
            }

            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.setAttribute('aria-haspopup', 'true');

            dropdownButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.#toggleDropdown(dropdownButton, dropdownMenu);
            });
        });
    }
}
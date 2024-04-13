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
                let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
                let dropdownMenu = document.getElementById(dropdownMenuId);

                if (!dropdownMenu) {
                    console.warn(`No dropdown menu found for ${dropdownMenuId}`);
                    return;
                }

                let dropdownButtonClick = dropdownButton.contains(event.target) || dropdownMenu.contains(event.target);

                if (!dropdownButtonClick) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.#dropdownButtonList.forEach((dropdownButton) => {
                    let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
                    let dropdownMenu = document.getElementById(dropdownMenuId);

                    if (dropdownButton.getAttribute('aria-expanded') === 'true') {
                        this.#closeDropdown(dropdownButton, dropdownMenu);
                        dropdownButton.focus();
                    }
                });
            }
        });

        this.#dropdownButtonList.forEach((dropdownButton) => {
            let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
            let dropdownMenu = document.getElementById(dropdownMenuId);

            if (!dropdownMenu) {
                console.warn(`No dropdown menu found for ${dropdownMenuId}`);
                return;
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
//////////////////////////////////////////////
// Navigation
//////////////////////////////////////////////

export default class Navigation {

    #dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');

    #toggleDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.toggle('shown');
        let expanded = dropdownButton.getAttribute('aria-expanded');

        if (expanded === 'true') {
            dropdownButton.setAttribute('aria-expanded', 'false');
        } else if (expanded === 'false') {
            dropdownButton.setAttribute('aria-expanded', 'true');
        }
    }

    #closeDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.remove('shown');
        dropdownButton.setAttribute('aria-expanded', 'false');
    }

    init() {
	
        // Check if there are dropdown buttons
        if (!this.#dropdownButtonList) {
            console.warn('No dropdown buttons found');
            return;
        }

        // Single click listener for window
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

        this.#dropdownButtonList.forEach((dropdownButton) => {
            let dropdownMenu = dropdownButton.nextElementSibling;

            // Check if dropdown button has corresponding dropdown menu
            if (!dropdownMenu) {
                console.warn(`No dropdown menu found for dropdown button ${dropdownButton}`);
                return;
            }

            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.setAttribute('aria-haspopup', 'true');

            // Handle click event on the dropdown button
            dropdownButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.#toggleDropdown(dropdownButton, dropdownMenu);
            });
        });
    }
}
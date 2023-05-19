//////////////////////////////////////////////
// Navigation
//////////////////////////////////////////////

export default class Navigation {

	#dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');

	// Helper methods
	toggleDropdown(dropdownButton, dropdownMenu) {
		dropdownMenu.classList.toggle('shown');
		let expanded = dropdownButton.getAttribute('aria-expanded');

		if (expanded === 'true') {
			dropdownButton.setAttribute('aria-expanded', false);
		} else if (expanded === 'false') {
			dropdownButton.setAttribute('aria-expanded', true);
		}
	}

	closeDropdown(dropdownButton, dropdownMenu) {
		dropdownMenu.classList.remove('shown');
		dropdownButton.setAttribute('aria-expanded', false);
	}

	// Init method
	init() {
		this.#dropdownButtonList.forEach((dropdownButton) => {
			let dropdownButtonParent = dropdownButton.closest('li');
			let dropdownMenu = dropdownButton.nextElementSibling;

			dropdownButton.setAttribute('aria-expanded', false);
			dropdownButton.setAttribute('aria-haspopup', true);

			// Handle click event on the dropdown button
			dropdownButton.addEventListener('click', (event) => {
				event.preventDefault();
				this.toggleDropdown(dropdownButton, dropdownMenu);
			});

			// Handle click event anywhere on the window
			window.addEventListener('click', (event) => {
				let dropdownButtonClick = dropdownButtonParent.contains(event.target);
				if (!dropdownButtonClick) {
					this.closeDropdown(dropdownButton, dropdownMenu);
				}
			});
		});
	}
}

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

			const hoverable = dropdownButton.hasAttribute('data-dropdown-hover');
			const eventType = hoverable ? 'mouseenter' : 'click';
			let timeoutID;
			let leaveTimeoutID;

			// Handle event on the dropdown button
			dropdownButton.addEventListener(eventType, (event) => {
				event.preventDefault();
				clearTimeout(leaveTimeoutID); // Clear any existing leave timeouts
				if (!dropdownMenu.classList.contains('shown')) { // Check if dropdown is not already visible
					timeoutID = setTimeout(() => {
						this.toggleDropdown(dropdownButton, dropdownMenu);
					}, 500); // 500ms delay
				}
			});

			// Handle focus event on the dropdown button for accessibility
			dropdownButton.addEventListener('focus', (event) => {
				this.toggleDropdown(dropdownButton, dropdownMenu);
			});

			// Handle focusout event on the dropdown item for accessibility
			dropdownButtonParent.addEventListener('focusout', (event) => {
				// Delay the closing action so we can check the newly focused element
				setTimeout(() => {
					// If no child element of the dropdown item is currently focused...
					if (!dropdownButtonParent.contains(document.activeElement)) {
						// Close the dropdown
						this.closeDropdown(dropdownButton, dropdownMenu);
					}
				}, 0);
			});

			if (hoverable) {
				// Handle mouseleave event on the dropdown button and its parent
				dropdownButtonParent.addEventListener('mouseleave', (event) => {
					event.preventDefault();
					clearTimeout(timeoutID); // Clear any existing timeouts
					leaveTimeoutID = setTimeout(() => {
						// Only close the dropdown if mouse is not hovering over the parent li
						if (!dropdownButtonParent.matches(':hover')) {
							this.closeDropdown(dropdownButton, dropdownMenu);
						}
					}, 500); // 500ms delay
				});

				// Handle mouseenter event to cancel leave timeout
				dropdownButtonParent.addEventListener('mouseenter', (event) => {
					event.preventDefault();
					clearTimeout(leaveTimeoutID); // Clear any existing leave timeouts
				});
			}

			// Handle click event anywhere on the window
			window.addEventListener('click', (event) => {
				let dropdownButtonClick = dropdownButtonParent.contains(event.target);
				if (!dropdownButtonClick) {
					clearTimeout(timeoutID);
					clearTimeout(leaveTimeoutID);
					this.closeDropdown(dropdownButton, dropdownMenu);
				}
			});
		});
	}
}

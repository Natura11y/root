//////////////////////////////////////////////
// Collapse
//////////////////////////////////////////////

import { getFocusableElements } from './utilities/focus';

export default class Collapse {

	#collapseButtonList = document.querySelectorAll('[data-target-toggle]');

	handleClose(button, target) {
		button.setAttribute('aria-expanded', false);
		target.classList.remove('shown');
	}

	handleOpen(button, target, focusFirst) {
		button.setAttribute('aria-expanded', true);
		target.classList.add('shown');
		if (focusFirst) {
			focusFirst.focus();
		}
	}

	toggleCollapse(event, collapseButton) {
		const collapseTargetID = event.target
			.getAttribute('data-target-toggle')
			.replace(/#/, '');
            
		const collapseTarget = document.getElementById(collapseTargetID);

		const focusableElements = getFocusableElements(collapseTarget);
		const firstFocusableElement = focusableElements[0];

		const isExpanded = collapseButton.getAttribute('aria-expanded');

		if (isExpanded === 'true') {
			this.handleClose(collapseButton, collapseTarget);
		} else if (isExpanded === 'false') {
			this.handleOpen(
				collapseButton,
				collapseTarget,
				collapseTarget.hasAttribute('data-focus-first')
					? firstFocusableElement
					: null
			);
		}

		return { collapseTarget, firstFocusableElement };
	}

	handleKeyDown(event, collapseButton, collapseTarget, firstFocusableElement) {
		switch (event.code) {
			case 'Tab':
				if (
					document.activeElement === firstFocusableElement &&
					event.shiftKey
				) {
					event.preventDefault();
					collapseButton.focus();
				}
				break;
			case 'Escape':
				this.handleClose(collapseButton, collapseTarget);
				break;
			default:
			// do nothing
		}
	}

	init() {
		this.#collapseButtonList.forEach((collapseButton) => {
			collapseButton.setAttribute('aria-expanded', false);

			collapseButton.addEventListener('click', (event) => {
				const { collapseTarget, firstFocusableElement } = this.toggleCollapse(
					event,
					collapseButton
				);

				collapseTarget.addEventListener('keydown', (event) => {
					this.handleKeyDown(
						event,
						collapseButton,
						collapseTarget,
						firstFocusableElement
					);
				});

				if (collapseButton.hasAttribute('data-target-close')) {
					const closeTargetID = event.target
						.getAttribute('data-target-close')
						.replace(/#/, '');
					const closeTarget = document.getElementById(closeTargetID);
					const closeTargetButton = document.querySelector(
						`[data-target-toggle="#${closeTargetID}"]`
					);

					this.handleClose(closeTargetButton, closeTarget);
				}
			});
		});
	}
}
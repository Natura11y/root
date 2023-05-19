//////////////////////////////////////////////
// Buttons
//////////////////////////////////////////////

export default class Button {

	#buttonIconOnlyList = document.querySelectorAll('.button--icon-only');

	hoverFocusIn(event, buttonList) {
		const hoverFocusDelay = setTimeout(() => {
			buttonList.forEach((buttonIconOnly) => {
				buttonIconOnly.classList.remove('tooltip-show');
			});

			event.target.classList.add('tooltip-show');
		}, 300);
		return hoverFocusDelay;
	}

	hoverFocusOut(event, hoverFocusDelay) {
		clearTimeout(hoverFocusDelay);
		event.target.classList.remove('tooltip-show');
	}

	tooltipPosition(buttonIconOnly, buttonTooltip) {
		const buttonTooltipWidth = buttonTooltip.offsetWidth / 2;
		const buttonPositionLeft = buttonIconOnly.offsetLeft;
		const buttonPositionRight =
			window.innerWidth -
			(buttonIconOnly.offsetLeft + buttonIconOnly.offsetWidth);

		if (buttonTooltipWidth > buttonPositionLeft) {
			buttonTooltip.classList.add('left');
		}

		if (buttonTooltipWidth > buttonPositionRight) {
			buttonTooltip.classList.add('right');
		}
	}

	handleTooltip(buttonIconOnly, tooltipText) {

		const tooltipHTML = `
            <span class="button__tooltip">
                ${tooltipText}
            </span>
        `;

		if (tooltipText) {
			buttonIconOnly.insertAdjacentHTML('beforeend', tooltipHTML);

			const buttonTooltip = buttonIconOnly.querySelector('.button__tooltip');

			this.tooltipPosition(buttonIconOnly, buttonTooltip);
			window.addEventListener('resize', () =>
				this.tooltipPosition(buttonIconOnly, buttonTooltip)
			);

			let hoverFocusDelay;

			buttonIconOnly.addEventListener('mouseenter', (event) => {
				hoverFocusDelay = this.hoverFocusIn(event, this.#buttonIconOnlyList);
			});

			buttonIconOnly.addEventListener('focusin', (event) => {
				hoverFocusDelay = this.hoverFocusIn(event, this.#buttonIconOnlyList);
			});

			buttonIconOnly.addEventListener('mouseleave', (event) => {
				this.hoverFocusOut(event, hoverFocusDelay);
			});

			buttonIconOnly.addEventListener('focusout', (event) => {
				this.hoverFocusOut(event, hoverFocusDelay);
			});
		}
	}

	init() {
		this.#buttonIconOnlyList.forEach((buttonIconOnly) => {
			const tooltipText = buttonIconOnly.getAttribute('aria-label');
			this.handleTooltip(buttonIconOnly, tooltipText);
		});
	}
}
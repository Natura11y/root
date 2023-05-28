export default class Button {

    // Private properties
    #buttonIconOnlyList;

    constructor() {
        this.#buttonIconOnlyList = document.querySelectorAll('.button--icon-only');
    }

    // Private methods
    
    #handleHoverFocusIn = (buttonList) => {
        return (event) => {
            const hoverFocusDelay = setTimeout(() => {
                buttonList.forEach((buttonIconOnly) => {
                    buttonIconOnly.classList.remove('tooltip-show');
                });
                event.target.classList.add('tooltip-show');
            }, 300);

            return hoverFocusDelay;
        };
    }

    #handleHoverFocusOut = () => {
        return (event, hoverFocusDelay) => {
            clearTimeout(hoverFocusDelay);
            event.target.classList.remove('tooltip-show');
        };
    }

    // Calculate the position of the tooltip and apply corresponding CSS classes
    #tooltipPosition(buttonIconOnly, buttonTooltip) {
        const buttonTooltipWidth = buttonTooltip.offsetWidth / 2;
        const buttonPositionLeft = buttonIconOnly.offsetLeft;
        const buttonPositionRight = window.innerWidth - (buttonIconOnly.offsetLeft + buttonIconOnly.offsetWidth);

        if (buttonTooltipWidth > buttonPositionLeft) {
            buttonTooltip.classList.add('left');
        }

        if (buttonTooltipWidth > buttonPositionRight) {
            buttonTooltip.classList.add('right');
        }
    }

    // Handle the creation and position of the tooltip, as well as the hover and focus in/out events
    #handleTooltip = (buttonIconOnly, tooltipText) => {
        const tooltipHTML = `
            <span class="button__tooltip">
                ${tooltipText}
            </span>
        `;

        if (tooltipText) {
            buttonIconOnly.insertAdjacentHTML('beforeend', tooltipHTML);
            const buttonTooltip = buttonIconOnly.querySelector('.button__tooltip');

            this.#tooltipPosition(buttonIconOnly, buttonTooltip);
            window.addEventListener('resize', () => this.#tooltipPosition(buttonIconOnly, buttonTooltip));

            let hoverFocusDelay;

            buttonIconOnly.addEventListener('mouseenter', (event) => {
                hoverFocusDelay = this.#handleHoverFocusIn(this.#buttonIconOnlyList)(event);
            });

            buttonIconOnly.addEventListener('focusin', (event) => {
                hoverFocusDelay = this.#handleHoverFocusIn(this.#buttonIconOnlyList)(event);
            });

            buttonIconOnly.addEventListener('mouseleave', (event) => {
                this.#handleHoverFocusOut()(event, hoverFocusDelay);
            });

            buttonIconOnly.addEventListener('focusout', (event) => {
                this.#handleHoverFocusOut()(event, hoverFocusDelay);
            });
        }
    }

    // Public methods
    render() {
        this.#buttonIconOnlyList.forEach((buttonIconOnly) => {
            const tooltipText = buttonIconOnly.getAttribute('aria-label');
            this.#handleTooltip(buttonIconOnly, tooltipText);
        });
    }
}

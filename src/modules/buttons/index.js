import './_style.scss';

//////////////////////////////////////////////
// Buttons
//////////////////////////////////////////////

export default class Button {

    #buttonIconOnlyList = document.querySelectorAll('.button--icon-only');

    init() {
    
        let hoverFocusDelay;

        const hoverFocusIn = (event) => {
            hoverFocusDelay = setTimeout(() => { 
                this.#buttonIconOnlyList.forEach((buttonIconOnly) => {
                    buttonIconOnly.classList.remove('tooltip-show');
                });

                event.target.classList.add('tooltip-show');
                
            }, 300);
        };

        const hoverFocusOut = (event) => {
            clearTimeout(hoverFocusDelay);
            event.target.classList.remove('tooltip-show');
        }

        this.#buttonIconOnlyList.forEach((buttonIconOnly) => {

            const tooltipText = buttonIconOnly.getAttribute('aria-label');

            const tooltipHTML = (`
                <span class="button__tooltip">
                    ${tooltipText}
                </span>
            `);

            if(tooltipText) {

                buttonIconOnly.insertAdjacentHTML('beforeend', tooltipHTML);
                
                const buttonTooltip = buttonIconOnly.querySelector('.button__tooltip');

                const tooltipPosition = () => {

                    const buttonTooltipWidth = buttonTooltip.offsetWidth / 2;
                    const buttonPositionLeft = buttonIconOnly.offsetLeft;
                    const buttonPositionRight = window.innerWidth - (buttonIconOnly.offsetLeft + buttonIconOnly.offsetWidth);

                    if (buttonTooltipWidth > buttonPositionLeft) {
                        buttonTooltip.classList.add('left');
                    }

                    if (buttonTooltipWidth > buttonPositionRight) {
                        buttonTooltip.classList.add('right');
                    }

                };

                tooltipPosition();
                window.addEventListener('resize', tooltipPosition);

                buttonIconOnly.addEventListener('mouseenter', hoverFocusIn);
                buttonIconOnly.addEventListener('focusin', hoverFocusIn);

                buttonIconOnly.addEventListener('mouseleave', hoverFocusOut);
                buttonIconOnly.addEventListener('focusout', hoverFocusOut);
            }
            
        });
    }
}
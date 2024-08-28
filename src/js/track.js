import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;
    #scrollAmount = 0;  // Store the scroll amount

    // Private methods

    #calculateEffectiveWidth(trackContainer) {
        const containerWidth = trackContainer.offsetWidth;
        const panelPeeking = parseFloat(getComputedStyle(trackContainer).getPropertyValue('--panel-peaking')) || 0;
        return containerWidth - panelPeeking;
    }

    #scrollByAmount(trackContainer, amount) {
        trackContainer.scrollBy({ left: amount, behavior: 'smooth' });
    }

    #scrollToPosition(trackContainer, position) {
        trackContainer.scrollTo({ left: position, behavior: 'smooth' });
        this.#updatePagination(trackContainer.closest('.track'));
    }

    #handleScrollEvent(trackContainer, direction) {
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);
        const scrollLeft = trackContainer.scrollLeft;
        const nextScrollPosition = Math.max(0, Math.min(scrollLeft + (direction * effectiveWidth), trackContainer.scrollWidth - trackContainer.offsetWidth));
        this.#scrollToPosition(trackContainer, nextScrollPosition);
    }

    #calculateTotalPages(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);
        return Math.ceil(trackContainer.scrollWidth / effectiveWidth);
    }

    #generatePagination(trackElement) {
        const totalPages = this.#calculateTotalPages(trackElement);

        const paginationContainer = trackElement.querySelector('.track__pagination');
        if (!paginationContainer) return;

        // Only update if the number of pages changes
        if (paginationContainer.childElementCount !== totalPages) {
            paginationContainer.innerHTML = '';

            Array.from({ length: totalPages }).forEach((_, i) => {
                const listItem = document.createElement('li');
                const button = document.createElement('button');

                button.className = 'track__pagination__item';
                button.setAttribute('data-item', i);
                button.setAttribute('aria-label', `Page ${i + 1}`);

                if (i === 0) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'true');
                }

                listItem.appendChild(button);
                paginationContainer.appendChild(listItem);
            });
        }

        return totalPages;
    }

    #updatePagination(trackElement, paginationItems) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const scrollLeft = trackContainer.scrollLeft;
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);

        // Calculate the active index directly based on scroll position
        let activeIndex = Math.round(scrollLeft / effectiveWidth);

        // Ensure activeIndex doesn't go out of bounds
        activeIndex = Math.min(activeIndex, paginationItems.length - 1);
        activeIndex = Math.max(activeIndex, 0);

        paginationItems.forEach((item, index) => {
            item.setAttribute('aria-current', index === activeIndex);
            item.classList.toggle('active', index === activeIndex);
        });

        this.#updateLiveRegion(trackElement, activeIndex, paginationItems.length);
    }

    #resetPagination(trackElement) {
        const totalPages = this.#generatePagination(trackElement);
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');

        this.#updatePagination(trackElement, paginationItems);
        this.#scrollAmount = this.#calculateEffectiveWidth(trackElement.querySelector('.track__panels'));

        if (totalPages === 1) {
            trackElement.classList.add('hide-controls');
        } else {
            trackElement.classList.remove('hide-controls');
        }
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const prevButton = trackElement.querySelector('.track__prev');
        const nextButton = trackElement.querySelector('.track__next');

        this.#scrollAmount = this.#calculateEffectiveWidth(trackPanels);

        if (prevButton) {
            prevButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.#scrollByAmount(trackPanels, -this.#scrollAmount);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (event) => {
                event.stopPropagation();
                this.#scrollByAmount(trackPanels, this.#scrollAmount);
            });
        }

        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            const newPosition = newIndex * this.#scrollAmount;
            this.#scrollToPosition(trackPanels, newPosition);
        });

        trackPanels.addEventListener('scroll', () => {
            clearTimeout(this.#scrollTimeout);
            this.#scrollTimeout = setTimeout(() => {
                const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
                this.#updatePagination(trackElement, paginationItems);
            }, 75);  // Debounce delay to ensure scroll has stopped
        });

        trackElement.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.#scrollByAmount(trackPanels, -this.#scrollAmount);
                    break;
                case 'ArrowRight':
                    this.#scrollByAmount(trackElement.querySelector('.track__panels'), this.#scrollAmount);
                    break;
                default:
                    break;
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.#resetPagination(trackElement);
        });
    }

    #initLiveRegion(trackElement) {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('liveregion', 'screen-reader-only');
        trackElement.appendChild(liveRegion);
    }

    #updateLiveRegion(trackElement, currentIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${currentIndex + 1} of ${totalPages}`;
        }
    }

    // Public methods

    init() {
        this.#trackList.forEach((trackElement) => {
            this.#resetPagination(trackElement);
            this.#initLiveRegion(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}
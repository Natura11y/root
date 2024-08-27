import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');

    // Private methods

    #calculateEffectiveWidth(trackContainer) {
        const containerWidth = trackContainer.offsetWidth;
        const panelPeeking = parseFloat(getComputedStyle(trackContainer).getPropertyValue('--panel-peaking')) || 0;
        return containerWidth - panelPeeking;
    }

    #calculateTotalPages(trackContainer) {
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);
        return Math.ceil(trackContainer.scrollWidth / effectiveWidth);
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

    #generatePagination(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const totalPages = this.#calculateTotalPages(trackContainer);

        const paginationContainer = trackElement.querySelector('.track__pagination');
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

        return totalPages;
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        paginationItems.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.setAttribute('aria-current', isActive);
            item.classList.toggle('active', isActive);
        });

        this.#updateLiveRegion(trackElement, activeIndex, paginationItems.length);
    }

    #initIntersectionObserver(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const panels = trackContainer.querySelectorAll('.track__panel');
        const totalPages = this.#calculateTotalPages(trackContainer);

        const observerOptions = {
            root: trackContainer,
            threshold: 0.5 // Adjust this threshold as needed
        };

        const observerCallback = (entries) => {
            let visiblePanels = [];

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visiblePanels.push(entry.target);
                }
            });

            if (visiblePanels.length) {
                const firstVisiblePanel = visiblePanels[0];
                const snappedIndex = Array.from(panels).indexOf(firstVisiblePanel);
                const visiblePanelsCount = Math.floor(trackContainer.offsetWidth / panels[0].offsetWidth);
                const activeIndex = Math.floor(snappedIndex / visiblePanelsCount);

                // Update pagination based on the active page index
                this.#updatePagination(trackElement, activeIndex);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe each panel
        panels.forEach(panel => {
            observer.observe(panel);
        });
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const prevButton = trackElement.querySelector('.track__prev');
        const nextButton = trackElement.querySelector('.track__next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.#handleScrollEvent(trackPanels, -1); // Scroll left
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.#handleScrollEvent(trackPanels, 1); // Scroll right
            });
        }

        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            const newPosition = newIndex * this.#calculateEffectiveWidth(trackPanels);
            this.#scrollToPosition(trackPanels, newPosition);
        });

        window.addEventListener('resize', () => {
            this.#generatePagination(trackElement);
            this.#initIntersectionObserver(trackElement); // Re-init observer on resize
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
            this.#generatePagination(trackElement);
            this.#initLiveRegion(trackElement);
            this.#initEventListeners(trackElement);
            this.#initIntersectionObserver(trackElement);
        });
    }
}

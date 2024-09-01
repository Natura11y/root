export default class Track {

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null; // To debounce the scroll event

    // Private methods

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #getTotalPages(trackPanels) {
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const totalPanels = trackPanels.children.length - 1; // Adjust for the duplicated panel
        return Math.ceil(totalPanels / visiblePanels);
    }

    #generatePagination(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const totalPages = this.#getTotalPages(trackPanels);
        const paginationContainer = trackElement.querySelector('.track__pagination');

        if (!paginationContainer) return;

        paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <li>
                <button
                    class="track__pagination__item ${i === 0 ? 'active' : ''}"
                    data-item="${i}"
                    aria-label="Page ${i + 1}"
                    ${i === 0 ? 'aria-current="true"' : ''}
                ></button>
            </li>
        `).join('');

        this.#toggleControlsVisibility(trackElement, totalPages);
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        if (totalPages <= 1) {
            trackElement.classList.add('hide-controls');
        } else {
            trackElement.classList.remove('hide-controls');
        }
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });
    }

    #updateLiveRegion(trackElement, activeIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${activeIndex + 1} of ${totalPages}`;
        }
    }

    #scrollToPage(trackElement, pageIndex) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const panelWidth = trackPanels.children[0].offsetWidth;
        const targetScrollLeft = pageIndex * panelWidth * visiblePanels;

        trackPanels.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        this.#updatePagination(trackElement, pageIndex);
        this.#updateLiveRegion(trackElement, pageIndex, this.#getTotalPages(trackPanels));
    }

    #getCurrentPageIndex(trackPanels) {
        const scrollLeft = trackPanels.scrollLeft;
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const panelWidth = trackPanels.children[0].offsetWidth;
        return Math.round(scrollLeft / (panelWidth * visiblePanels));
    }

    #duplicateFirstPanelContent(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const firstPanelChild = trackPanels.children[0].firstElementChild.cloneNode(true);
        const lastPanel = trackPanels.children[trackPanels.children.length - 1];
        
        // Create a container for the duplicate and append the cloned content
        const duplicateContainer = document.createElement('div');
        duplicateContainer.classList.add('track__panel__duplicate');
        duplicateContainer.setAttribute('tabindex', '-1');
        duplicateContainer.setAttribute('aria-hidden', 'true');

        firstPanelChild.removeAttribute('id'); // Remove id to avoid duplicates
        duplicateContainer.appendChild(firstPanelChild);

        lastPanel.appendChild(duplicateContainer);
    }

    #resetScrollPosition(trackElement, targetPageIndex) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const panelWidth = trackPanels.children[0].offsetWidth;
        const visiblePanels = this.#getVisiblePanels(trackPanels);

        const targetScrollLeft = targetPageIndex * panelWidth * visiblePanels;
        trackPanels.scrollLeft = targetScrollLeft; // Instantly reset scroll position

        this.#updatePagination(trackElement, targetPageIndex);
        this.#updateLiveRegion(trackElement, targetPageIndex, this.#getTotalPages(trackPanels));
    }

    #resetTrack(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');

        paginationContainer.innerHTML = '';
        trackPanels.scrollLeft = 0;

        // Before resetting, duplicate the first panel content if looping is enabled
        if (trackElement.classList.contains('loop-enabled')) {
            this.#duplicateFirstPanelContent(trackElement);
        }

        this.#generatePagination(trackElement);
        this.#initLiveRegion(trackElement);
    }

    #initLiveRegion(trackElement) {
        let liveRegion = trackElement.querySelector('.liveregion');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'liveregion screen-reader-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            trackElement.appendChild(liveRegion);
        }
    }

    #handleScrollEvent(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const visiblePanels = this.#getVisiblePanels(trackPanels);

        clearTimeout(this.#scrollTimeout);

        // Debounce the scroll event: only update after scrolling stops
        this.#scrollTimeout = setTimeout(() => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            const lastRealPanelIndex = trackPanels.children.length - visiblePanels - 1;

            // If scrolling past the last real panel, reset scroll to the start.
            if (currentIndex >= lastRealPanelIndex) {
                this.#resetScrollPosition(trackElement, 0);
            } else {
                this.#updatePagination(trackElement, currentIndex);
                this.#updateLiveRegion(trackElement, currentIndex, this.#getTotalPages(trackPanels));
            }
        }, 250); // Adjust the delay if necessary (250ms is a common debounce time)
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');

        trackElement.querySelector('.track__pagination')?.addEventListener('click', (event) => {
            if (event.target.closest('.track__pagination__item')) {
                const newIndex = parseInt(event.target.getAttribute('data-item'));
                this.#scrollToPage(trackElement, newIndex);
            }
        });

        trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            if (currentIndex === 0) {
                const lastRealPanelIndex = trackPanels.children.length - this.#getVisiblePanels(trackPanels) - 1;
                this.#resetScrollPosition(trackElement, lastRealPanelIndex);
            } else {
                this.#scrollToPage(trackElement, currentIndex - 1);
            }
        });

        trackElement.querySelector('.track__next')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            const totalPages = this.#getTotalPages(trackPanels);
            if (currentIndex >= totalPages - 1) {
                this.#resetScrollPosition(trackElement, 0);
            } else {
                this.#scrollToPage(trackElement, currentIndex + 1);
            }
        });

        // Debounced scroll event listener
        trackPanels.addEventListener('scroll', () => {
            this.#handleScrollEvent(trackElement);
        });

        window.addEventListener('resize', () => {
            this.#resetTrack(trackElement);
        });
    }

    // Public methods

    init() {
        this.#trackList.forEach(trackElement => {
            // Add class for looping if needed
            if (trackElement.hasAttribute('data-loop')) {
                trackElement.classList.add('loop-enabled');
            }

            this.#resetTrack(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}
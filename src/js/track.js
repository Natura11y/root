export default class Track {
    #trackList = document.querySelectorAll('.track');

    #updatePagination(trackElement, paginationItems) {
        const trackContainer = trackElement.querySelector('.track__container');
        const scrollLeft = trackContainer.scrollLeft;
        const itemWidth = trackContainer.offsetWidth / this.#getVisiblePanels(trackElement);

        // Calculate the number of pages
        const totalPages = paginationItems.length;

        // Calculate the current active index
        let activeIndex = Math.round(scrollLeft / itemWidth);

        // Handle the edge case where we're at the very end
        if (activeIndex >= totalPages) {
            activeIndex = totalPages - 1;
        }

        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });

        this.#updateLiveRegion(trackElement, activeIndex, paginationItems.length);
    }

    #updateLiveRegion(trackElement, currentIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${currentIndex + 1} of ${totalPages}`;
        }
    }

    #initEventListeners(trackElement) {
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        const trackContainer = trackElement.querySelector('.track__container');
        const visiblePanels = this.#getVisiblePanels(trackElement);
        const scrollAmount = trackContainer.offsetWidth;

        trackElement.querySelector('.track__prev').addEventListener('click', () => {
            trackContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        trackElement.querySelector('.track__next').addEventListener('click', () => {
            trackContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        paginationItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                trackContainer.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
            });
        });

        trackContainer.addEventListener('scroll', () => {
            this.#updatePagination(trackElement, paginationItems);
        });
    }

    #getVisiblePanels(trackElement) {
        return parseInt(trackElement.getAttribute('data-visible-panels')) || 1;
    }

    #applyStyles(trackElement) {
        const visiblePanels = this.#getVisiblePanels(trackElement);
        trackElement.style.setProperty('--visible-panels', visiblePanels);

        trackElement.querySelectorAll('.track__item').forEach(item => {
            item.style.flex = `0 0 calc(100% / ${visiblePanels})`;
        });
    }

    #generatePagination(trackElement, itemCount) {
        const paginationContainer = trackElement.querySelector('.track__pagination');
        if (!paginationContainer) return;

        const visiblePanels = this.#getVisiblePanels(trackElement);
        const totalPages = Math.ceil(itemCount / visiblePanels);

        paginationContainer.innerHTML = ''; // Clear existing pagination

        const paginationItems = Array.from({ length: totalPages }).map((_, i) => {
            const button = document.createElement('button');
            button.className = 'track__pagination__item';
            button.setAttribute('data-item', i);
            if (i === 0) {
                button.classList.add('active');
            }

            paginationContainer.appendChild(button);
            return button;
        });
    }

    #initLiveRegion(trackElement) {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('liveregion', 'screen-reader-only');
        trackElement.appendChild(liveRegion);
    }

    init() {
        this.#trackList.forEach((trackElement) => {
            this.#applyStyles(trackElement);
            const items = trackElement.querySelectorAll('.track__item');
            this.#generatePagination(trackElement, items.length);
            this.#initLiveRegion(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}
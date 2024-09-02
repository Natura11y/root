export default class Track {
    #trackList = document.querySelectorAll('.track');
    #currentPageIndex = 0;  // Keep track of the current page index internally

    // Private methods

    #getVisiblePanels(trackElement) {
        const visiblePanels = parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
        return visiblePanels;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        trackElement.classList.toggle('hide-controls', totalPages <= 1);
    }

    #generatePagination(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const trackId = trackElement.getAttribute('data-track-id');
        
        let pages = [];
        let currentPage = [];
        
        Array.from(trackPanels.children).forEach((panel, index) => {
            const panelId = `${trackId}-panel-${index}`;
            panel.setAttribute('id', panelId);
            currentPage.push(panel);
            if (currentPage.length === visiblePanels || index === trackPanels.children.length - 1) {
                pages.push(currentPage);
                currentPage = [];
            }
        });

        trackElement.pages = pages;

        paginationContainer.innerHTML = pages.map((page, i) => `
            <li>
                <button
                    type="button"
                    class="track__pagination__item ${i === 0 ? 'active' : ''}"
                    data-page-index="${i}"
                    aria-label="Page ${i + 1}"
                    ${i === 0 ? 'aria-current="true"' : ''}
                ></button>
            </li>
        `).join('');

        this.#toggleControlsVisibility(trackElement, pages.length);
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });
    }

    #scrollToPage(trackElement, pageIndex) {
    const trackPanels = trackElement.querySelector('.track__panels');
    const targetPanel = trackElement.pages[pageIndex][0]; // First panel of the target page
    
    // Immediately update the current page index
    this.#currentPageIndex = pageIndex;
    this.#updatePagination(trackElement, pageIndex);

    // Perform smooth scrolling
    trackPanels.scrollTo({
        left: targetPanel.offsetLeft,
        behavior: 'smooth'
    });
}


    #observePanels(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const panelId = entry.target.id;
                    
                    // Find the page that contains this panel
                    const pageIndex = trackElement.pages.findIndex(page =>
                        page.some(panel => panel.id === panelId)  // Check all panels in the page
                    );

                    if (pageIndex !== -1) {
                        this.#updatePagination(trackElement, pageIndex);
                        this.#currentPageIndex = pageIndex; // Update internal index
                    }
                }
            });
        }, {
            root: trackPanels,
            threshold: 0.5 // Adjust threshold as needed
        });

        // Observe the first panel of each page
        trackElement.pages.forEach(page => {
            observer.observe(page[0]); // Observe only the first panel in each page
        });
    }

    #resetTrack(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');

        trackPanels.scrollLeft = 0;
        this.#currentPageIndex = 0;  // Reset the page index
        paginationContainer.innerHTML = '';

        this.#generatePagination(trackElement);
        this.#initLiveRegion(trackElement);
        this.#observePanels(trackElement); // Initialize the observer
    }

   #initEventListeners(trackElement) {

    // Pagination click event
    trackElement.querySelector('.track__pagination')?.addEventListener('click', (event) => {
        const target = event.target.closest('.track__pagination__item');
        if (target) {
            const pageIndex = parseInt(target.getAttribute('data-page-index'));
            this.#scrollToPage(trackElement, pageIndex);
        }
    });

    // Previous button click event
    trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
        if (this.#currentPageIndex > 0) {
            this.#scrollToPage(trackElement, this.#currentPageIndex - 1);
        } else {
            this.#scrollToPage(trackElement, trackElement.pages.length - 1); // Wrap around to last page
        }
    });

    // Next button click event
    trackElement.querySelector('.track__next')?.addEventListener('click', () => {
        if (this.#currentPageIndex < trackElement.pages.length - 1) {
            this.#scrollToPage(trackElement, this.#currentPageIndex + 1);
        } else {
            this.#scrollToPage(trackElement, 0); // Wrap around to first page
        }
    });

    // Handle window resize events
    window.addEventListener('resize', () => {
        this.#resetTrack(trackElement);
    });
}


    #initLiveRegion(trackElement) {
        let liveRegion = trackElement.querySelector('.liveregion');

        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'liveregion screen-reader-onlyx';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            trackElement.appendChild(liveRegion);
        }
    }

    // Public methods

    init() {
        this.#trackList.forEach((trackElement, trackIndex) => {
            trackElement.setAttribute('data-track-id', `track-${trackIndex}`);
            this.#resetTrack(trackElement);
            this.#initEventListeners(trackElement);
        });
    }

}

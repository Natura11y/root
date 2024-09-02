export default class Track {

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null; // To debounce the scroll event

    // Private methods

    #getVisiblePanels(trackElement) {
        const visiblePanels = parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;

        console.log(`VISIBLE PANELS ${visiblePanels}`);

        return visiblePanels;
    }

    #getTotalPages(trackPanels) {
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const totalPanels = trackPanels.children.length;
        const pages = Math.ceil(totalPanels / visiblePanels);

        console.log('PAGES:', pages);
        
        return pages;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        trackElement.classList.toggle('hide-controls', totalPages <= 1);
    }


    #generatePagination(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const trackId = trackElement.getAttribute('data-track-id'); // Unique identifier for this track component
        
        let pages = [];
        let currentPage = [];
        
        Array.from(trackPanels.children).forEach((panel, index) => {
            // Assign a unique ID to each panel, incorporating the track ID
            const panelId = `${trackId}-panel-${index}`;
            panel.setAttribute('id', panelId);

            currentPage.push(panel);
            if (currentPage.length === visiblePanels || index === trackPanels.children.length - 1) {
                pages.push(currentPage);
                currentPage = [];
            }
        });

        trackElement.pages = pages;

        // Debugging output to verify pages structure
        console.log('Track Element ID:', trackId);
        console.log('Generated Pages:', pages);

        // Generate pagination buttons that link to panel IDs
        paginationContainer.innerHTML = pages.map((page, i) => `
            <li>
                <a
                    href="#${page[0].id}"
                    class="track__pagination__item ${i === 0 ? 'active' : ''}"
                    aria-label="Page ${i + 1}"
                    ${i === 0 ? 'aria-current="true"' : ''}
                ></a>
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

    #observePanels(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const panelId = entry.target.id;
                    
                    const pageIndex = trackElement.pages.findIndex(page =>
                        page.some(panel => panel.id === panelId)  // Check all panels in the page
                    );

                    if (pageIndex !== -1) {
                        this.#updatePagination(trackElement, pageIndex);
                        this.#updateLiveRegion(trackElement, pageIndex, trackElement.pages.length);
                    }
                }
            });
        }, {
            root: trackPanels,
            threshold: 0.5 // Adjust threshold as needed
        });

        // Observe each panel
        Array.from(trackPanels.children).forEach(panel => observer.observe(panel));
    }

    #updateLiveRegion(trackElement, activeIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${activeIndex + 1} of ${totalPages}`;
        }
    }

    #getCurrentPageIndex(trackPanels) {
        const scrollLeft = trackPanels.scrollLeft;
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const panelWidth = trackPanels.children[0].offsetWidth;
        const pageIndex = Math.round(scrollLeft / (panelWidth * visiblePanels));

        console.log('PAGE-INDEX:', pageIndex);

        return pageIndex;
    }
    
    #resetTrack(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');

        trackPanels.scrollLeft = 0;
        paginationContainer.innerHTML = '';

        this.#generatePagination(trackElement);
        this.#initLiveRegion(trackElement);
    }

    #handleScrollEvent(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');

        clearTimeout(this.#scrollTimeout);

        // Debounce the scroll event: only update after scrolling stops
        this.#scrollTimeout = setTimeout(() => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            this.#updatePagination(trackElement, currentIndex);
            this.#updateLiveRegion(trackElement, currentIndex, this.#getTotalPages(trackPanels));
        }, 250); // Adjust the delay if necessary (250ms is a common debounce time)
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');

        // Pagination click event
        trackElement.querySelector('.track__pagination')?.addEventListener('click', (event) => {
            const target = event.target.closest('.track__pagination__item');
            if (target) {
                const pageIndex = parseInt(target.getAttribute('data-page-index'));
                this.#updatePagination(trackElement, pageIndex); // Update pagination state
            }
        });

        // Previous button click event
        trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            if (currentIndex > 0) {
                const targetPageIndex = currentIndex - 1;
                const targetAnchor = `#${trackElement.pages[targetPageIndex][0].id}`;
                window.location.href = targetAnchor; // Navigate via anchor link
            } else {
                const lastPageIndex = trackElement.pages.length - 1;
                const targetAnchor = `#${trackElement.pages[lastPageIndex][0].id}`;
                window.location.href = targetAnchor;
            }
        });

        // Next button click event
        trackElement.querySelector('.track__next')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            const totalPages = trackElement.pages.length;
            if (currentIndex < totalPages - 1) {
                const targetPageIndex = currentIndex + 1;
                const targetAnchor = `#${trackElement.pages[targetPageIndex][0].id}`;
                window.location.href = targetAnchor;
            } else {
                const targetAnchor = `#${trackElement.pages[0][0].id}`;
                window.location.href = targetAnchor;
            }
        });

        // Handle scroll events (primarily for updating pagination state)
        trackPanels.addEventListener('scroll', () => {
            this.#handleScrollEvent(trackElement);
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
            this.#observePanels(trackElement); // Initialize the observer for each track element
        });
    }

}
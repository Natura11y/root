export default class Track {

    // Private properties

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;  // Timeout to delay pagination update
    #isScrollingProgrammatically = false;  // Flag to track programmatic scrolling
    #visiblePanels = new Set(); // Track visible panels

    // Private methods

    #getVisiblePanels(trackElement) {
        const visiblePanels = parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
        return visiblePanels;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        const controls = trackElement.querySelectorAll('[data-track-prev], [data-track-next], [data-track-pagination]');
        controls.forEach(control => {
            if (totalPages <= 1) {
                control.style.display = 'none';
            } else {
                control.style.display = ''; // Reset to default if more than 1 page
            }
        });
    }

    #generatePages(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('[data-track-pagination]');
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
        trackElement.currentPageIndex = 0; // Initialize currentPageIndex for each track

        if (paginationContainer) {
            paginationContainer.innerHTML = pages.map((page, i) => `
                <li>
                    <button
                        type="button"
                        data-page-index="${i}"
                        aria-label="Page ${i + 1}"
                        ${i === 0 ? 'aria-current="true"' : ''}
                    ></button>
                </li>
            `).join('');
        }

        this.#toggleControlsVisibility(trackElement, pages.length);

        // Initialize observer after generating pages
        this.#observePanels(trackElement);

        // Ensure only panels on the first page are tabbable initially
        this.#updateTabIndexes(trackElement);
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = trackElement.querySelectorAll('[data-track-pagination] [data-page-index]');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });

        // Update the live region whenever pagination changes
        this.#updateLiveRegion(trackElement, activeIndex, trackElement.pages.length);

        // Update tabindex for all panels based on the current visibility
        this.#updateTabIndexes(trackElement);
    }

    #updateTabIndexes(trackElement) {
        // Reset all panels to not be tabbable
        trackElement.pages.flat().forEach(panel => {
            const interactiveElement = panel.firstElementChild;
            if (interactiveElement) {
                interactiveElement.setAttribute('tabindex', '-1');
            }
        });

        // Make only visible panels tabbable
        this.#visiblePanels.forEach(panel => {
            const interactiveElement = panel.firstElementChild;
            if (interactiveElement) {
                interactiveElement.removeAttribute('tabindex');
            }
        });
    }

    #scrollToPage(trackElement, pageIndex) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const targetPanel = trackElement.pages[pageIndex][0]; // First panel of the target page

        // Indicate that scrolling is being triggered programmatically
        this.#isScrollingProgrammatically = true;

        // Immediately update the track element's current page index
        trackElement.currentPageIndex = pageIndex;

        // Perform smooth scrolling
        trackPanels.scrollTo({
            left: targetPanel.offsetLeft,
            behavior: 'smooth'
        });

        // Debounce pagination update until scroll stops
        clearTimeout(this.#scrollTimeout);
        this.#scrollTimeout = setTimeout(() => {
            this.#updatePagination(trackElement, pageIndex);
            this.#isScrollingProgrammatically = false;  // Reset the flag after scroll completes
        }, 600);  // Adjust delay time as needed
    }

    #observePanels(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const panel = entry.target;
                if (entry.isIntersecting) {
                    this.#visiblePanels.add(panel);
                } else {
                    this.#visiblePanels.delete(panel);
                }
            });

            if (!this.#isScrollingProgrammatically) {
                this.#updateTabIndexes(trackElement);
            }
        }, {
            root: trackPanels,
            threshold: 0.5 // Adjust threshold as needed
        });

        // Observe all panels
        trackElement.pages.flat().forEach(panel => {
            observer.observe(panel);
        });
    }

    #resetTrack(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('[data-track-pagination]');

        trackPanels.scrollLeft = 0;
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        trackElement.currentPageIndex = 0;  // Reset the page index for this track

        this.#generatePages(trackElement);
        this.#initLiveRegion(trackElement);
    }

    #initEventListeners(trackElement) {

        // Pagination click event
        const paginationItems = trackElement.querySelectorAll('[data-track-pagination] [data-page-index]');
        if (paginationItems) {
            paginationItems.forEach(item => {
                item.addEventListener('click', (event) => {
                    const target = event.target.closest('[data-page-index]');
                    if (target) {
                        const pageIndex = parseInt(target.getAttribute('data-page-index'));
                        this.#scrollToPage(trackElement, pageIndex);
                    }
                });
            });
        }

        // Previous button click event
        const prevButton = trackElement.querySelector('[data-track-prev]');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (trackElement.currentPageIndex > 0) {
                    this.#scrollToPage(trackElement, trackElement.currentPageIndex - 1);
                } else {
                    this.#scrollToPage(trackElement, trackElement.pages.length - 1); // Wrap around to last page
                }
            });
        }

        // Next button click event
        const nextButton = trackElement.querySelector('[data-track-next]');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (trackElement.currentPageIndex < trackElement.pages.length - 1) {
                    this.#scrollToPage(trackElement, trackElement.currentPageIndex + 1);
                } else {
                    this.#scrollToPage(trackElement, 0); // Wrap around to first page
                }
            });
        }

        // Handle window resize events
        window.addEventListener('resize', () => {
            this.#resetTrack(trackElement);
        });
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

    #updateLiveRegion(trackElement, activeIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${activeIndex + 1} of ${totalPages}`;
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
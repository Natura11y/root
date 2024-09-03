import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    
    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;
    #elementCache = new WeakMap(); // Cache to store element references

    // Private methods
    
    #getElement(trackElement, selector) {
        if (!this.#elementCache.has(trackElement)) {
            this.#elementCache.set(trackElement, {});
        }
        const cache = this.#elementCache.get(trackElement);
        if (!cache[selector]) {
            cache[selector] = trackElement.querySelector(selector);
        }
        return cache[selector];
    }

    #getVisiblePanels(trackElement) {
        const visiblePanels = parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
        return visiblePanels;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        if (totalPages <= 1) {
            trackElement.classList.add('hide-controls');
        } else {
            trackElement.classList.remove('hide-controls');
        }
    }

    #generatePages(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const paginationContainer = this.#getElement(trackElement, '[data-track-pagination]');
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

        // Ensure only panels on the first page are tabbable
        this.#updateTabIndexes(trackElement, 0);
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = this.#getElement(trackElement, '[data-track-pagination]').querySelectorAll('[data-page-index]');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });

        // Update the live region whenever pagination changes
        this.#updateLiveRegion(trackElement, activeIndex, trackElement.pages.length);
    }

    #updateTabIndexes(trackElement, activeIndex) {
        trackElement.pages.forEach((page, pageIndex) => {
            page.forEach(panel => {
                const interactiveElement = panel.firstElementChild;
                if (interactiveElement) {
                    interactiveElement.setAttribute('tabindex', pageIndex === activeIndex ? '0' : '-1');
                }
            });
        });
    }

    #scrollToPage(trackElement, pageIndex) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const targetPanel = trackElement.pages[pageIndex][0]; // First panel of the target page

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
        }, 300);  // Adjust delay time as needed
    }

    #observePages(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const panelId = entry.target.id;
                if (entry.isIntersecting) {
                    const pageIndex = trackElement.pages.findIndex(page =>
                        page.some(panel => panel.id === panelId)
                    );

                    const updateOnScrollEnd = () => {
                        trackElement.currentPageIndex = pageIndex;
                        this.#updatePagination(trackElement, pageIndex);
                    };

                    if (pageIndex !== -1) {
                        if ('onscrollend' in window) {
                            trackPanels.onscrollend = updateOnScrollEnd;
                        } else {
                            trackPanels.onscroll = () => {
                                clearTimeout(scrollTimeout);
                                scrollTimeout = setTimeout(updateOnScrollEnd, 250);
                            };
                        }
                    }
                }
            });
        }, {
            root: trackPanels,
            threshold: 0.75
        });

        // Observe the first panel of each page
        trackElement.pages.forEach(page => {
            pageObserver.observe(page[0]);
        });

        // Store the observer in the track element for later disconnection
        trackElement.pageObserver = pageObserver;
    }

    #observeTabbing(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const tabbingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const interactiveElement = entry.target.firstElementChild;
                if (interactiveElement) {
                    interactiveElement.setAttribute('tabindex', entry.isIntersecting ? '0' : '-1');
                }
            });
        }, {
            root: trackPanels,
            threshold: 1
        });

        // Observe all panels
        trackElement.pages.flat().forEach(panel => {
            tabbingObserver.observe(panel);
        });

        // Store the observer in the track element for later disconnection
        trackElement.tabbingObserver = tabbingObserver;
    }

    #resetTrack(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const paginationContainer = this.#getElement(trackElement, '[data-track-pagination]');

        trackPanels.scrollLeft = 0;
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        // Disconnect observers before resetting
        if (trackElement.pageObserver) {
            trackElement.pageObserver.disconnect();
        }
        if (trackElement.tabbingObserver) {
            trackElement.tabbingObserver.disconnect();
        }

        trackElement.currentPageIndex = 0;  // Reset the page index for this track

        this.#generatePages(trackElement);
        this.#initLiveRegion(trackElement);
        this.#observePages(trackElement); // Initialize the page observer
        this.#observeTabbing(trackElement); // Initialize the tabbing observer
    }

    #initEventListeners(trackElement) {
        // Use delegateEvent to handle pagination clicks
        delegateEvent(trackElement, 'click', '[data-page-index]', (event) => {
            const target = event.target.closest('[data-page-index]');
            if (target) {
                const pageIndex = parseInt(target.getAttribute('data-page-index'));
                this.#scrollToPage(trackElement, pageIndex);
            }
        });

        // Previous button click event
        delegateEvent(trackElement, 'click', '[data-track-prev]', () => {
            if (trackElement.currentPageIndex > 0) {
                this.#scrollToPage(trackElement, trackElement.currentPageIndex - 1);
            } else {
                this.#scrollToPage(trackElement, trackElement.pages.length - 1); // Wrap around to last page
            }
        });

        // Next button click event
        delegateEvent(trackElement, 'click', '[data-track-next]', () => {
            if (trackElement.currentPageIndex < trackElement.pages.length - 1) {
                this.#scrollToPage(trackElement, trackElement.currentPageIndex + 1);
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
        let liveRegion = this.#getElement(trackElement, '.liveregion');

        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'liveregion screen-reader-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            trackElement.appendChild(liveRegion);
        }
    }

    #updateLiveRegion(trackElement, activeIndex, totalPages) {
        const liveRegion = this.#getElement(trackElement, '.liveregion');
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
import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;

    // Private methods

    #getElement(trackElement, selector) {
        return trackElement.querySelector(selector);
    }

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        trackElement.classList.toggle('hide-controls', totalPages <= 1);
    }

    #setupPagination(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const paginationContainer = this.#getElement(trackElement, '[data-track-pagination]');
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const trackId = trackElement.getAttribute('data-track-id');
        
        const pages = [];
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
        trackElement.currentPageIndex = 0;

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
        this.#updateTabIndexes(trackElement, 0);
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = this.#getElement(trackElement, '[data-track-pagination]').querySelectorAll('[data-page-index]');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });

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

    #navigateToPage(trackElement, pageIndex) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const targetPanel = trackElement.pages[pageIndex][0];

        trackElement.currentPageIndex = pageIndex;

        trackPanels.scrollTo({
            left: targetPanel.offsetLeft,
            behavior: 'smooth'
        });

        clearTimeout(this.#scrollTimeout);
        this.#scrollTimeout = setTimeout(() => {
            this.#updatePagination(trackElement, pageIndex);
        }, 300);
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
                                clearTimeout(this.#scrollTimeout);
                                this.#scrollTimeout = setTimeout(updateOnScrollEnd, 250);
                            };
                        }
                    }
                }
            });
        }, {
            root: trackPanels,
            threshold: 0.75
        });

        trackElement.pages.forEach(page => {
            pageObserver.observe(page[0]);
        });

        // *** Save the observer instance for cleanup later ***
        trackElement.pageObserver = pageObserver;
    }

    #setupTabbingObserver(trackElement) {
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
            threshold: 0.75
        });

        trackElement.pages.flat().forEach(panel => {
            tabbingObserver.observe(panel);
        });

        // *** Save the observer instance for cleanup later ***
        trackElement.tabbingObserver = tabbingObserver;
    }

    #resetTrackState(trackElement) {
        const trackPanels = this.#getElement(trackElement, '.track__panels');
        const paginationContainer = this.#getElement(trackElement, '[data-track-pagination]');

        // Reset scroll position
        trackPanels.scrollLeft = 0;

        // Clear pagination content
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        // *** Clean up existing observers ***
        if (trackElement.pageObserver) {
            trackElement.pageObserver.disconnect();
        }
        if (trackElement.tabbingObserver) {
            trackElement.tabbingObserver.disconnect();
        }

        trackElement.currentPageIndex = 0;

        // Reinitialize everything after resetting
        this.#setupPagination(trackElement);
        this.#initLiveRegion(trackElement);
        this.#observePages(trackElement);
        this.#setupTabbingObserver(trackElement);
    }


    #initEventListeners(trackElement) {
        delegateEvent(trackElement, 'click', '[data-page-index]', (event) => {
            const target = event.target.closest('[data-page-index]');
            if (target) {
                const pageIndex = parseInt(target.getAttribute('data-page-index'));
                this.#navigateToPage(trackElement, pageIndex);
            }
        });

        delegateEvent(trackElement, 'click', '[data-track-prev]', () => {
            const newIndex = trackElement.currentPageIndex > 0
                ? trackElement.currentPageIndex - 1
                : trackElement.pages.length - 1;
            this.#navigateToPage(trackElement, newIndex);
        });

        delegateEvent(trackElement, 'click', '[data-track-next]', () => {
            const newIndex = trackElement.currentPageIndex < trackElement.pages.length - 1
                ? trackElement.currentPageIndex + 1
                : 0;
            this.#navigateToPage(trackElement, newIndex);
        });

        // Reset track state on window resize
        window.addEventListener('resize', () => {
            this.#resetTrackState(trackElement);
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
            this.#resetTrackState(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
    
    destroy(trackElement) {
        if (trackElement.pageObserver) {
            trackElement.pageObserver.disconnect();
        }
        if (trackElement.tabbingObserver) {
            trackElement.tabbingObserver.disconnect();
        }
        // Clear any timeouts
        clearTimeout(this.#scrollTimeout);
    }
}
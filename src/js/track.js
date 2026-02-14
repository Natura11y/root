import { delegateEvent } from './utilities/eventDelegation';
import { getFocusableElements } from './utilities/focus';

export default class Track {

    // Private properties

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;
    #elementCache = new WeakMap();

    // Private methods
    
    #getCachedElements(trackElement) {
        if (!this.#elementCache.has(trackElement)) {
            this.#elementCache.set(trackElement, {
                panels: trackElement.querySelector('.track__panels'),
                pagination: trackElement.querySelector('[data-track-pagination]'),
                liveRegion: trackElement.querySelector('.liveregion')
            });
        }
        return this.#elementCache.get(trackElement);
    }

    #invalidateCache(trackElement) {
        this.#elementCache.delete(trackElement);
    }

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #toggleControlsVisibility(trackElement, totalPages) {
        trackElement.classList.toggle('hide-controls', totalPages <= 1);
    }

    #setupPagination(trackElement) {
        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;
        const paginationContainer = cached.pagination;
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const trackId = trackElement.getAttribute('data-track-id');

        // Prevent the panels container from being tabbable
        trackPanels.setAttribute('tabindex', '-1');

        const pages = [];
        let currentPage = [];

        Array.from(trackPanels.children).forEach((panel, index) => {
            const panelId = `${trackId}-panel-${index}`;
            panel.setAttribute('id', panelId);
            currentPage.push(panel);
            if (currentPage.length === visiblePanels || index === trackPanels.children.length - 1) {
                pages.push([...currentPage]);
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
                        aria-label="Go To Page ${i + 1}"
                        ${i === 0 ? 'aria-current="true"' : ''}
                    >
                        <span class="pagination__number">
                            ${i + 1}
                        </span>
                    </button>
                </li>
            `).join('');
        }

        this.#toggleControlsVisibility(trackElement, pages.length);
        this.#updateTabIndexes(trackElement, 0);
    }

    #updatePagination(trackElement, activeIndex) {
        const cached = this.#getCachedElements(trackElement);
        const paginationItems = cached.pagination?.querySelectorAll('[data-page-index]');
        
        if (paginationItems) {
            paginationItems.forEach((item, index) => {
                item.classList.toggle('active', index === activeIndex);
                item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
            });
        }

        this.#updateLiveRegion(trackElement, activeIndex, trackElement.pages.length);
    }

    // Use getFocusableElements to update all focusable elements' tabindex and aria-hidden
    #updateTabIndexes(trackElement, activeIndex) {
        trackElement.pages.forEach((page, pageIndex) => {
            page.forEach(panel => {
                const focusableElements = getFocusableElements(panel);  // Get all focusable elements in the panel

                // Set tabindex and aria-hidden based on visibility
                const isVisible = pageIndex === activeIndex;
                panel.setAttribute('aria-hidden', isVisible ? 'false' : 'true');  // Update aria-hidden

                focusableElements.forEach(el => {
                    el.setAttribute('tabindex', isVisible ? '0' : '-1');  // Enable or disable based on visibility
                });
            });
        });
    }

    // Primary method for navigating to a specific page index
    #navigateToPage(trackElement, pageIndex) {
        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;
        const targetPanel = trackElement.pages[pageIndex][0];

        trackElement.currentPageIndex = pageIndex;

        // Set flag to prevent observer interference during programmatic navigation
        trackElement.isNavigating = true;

        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        trackPanels.scrollTo({
            left: targetPanel.offsetLeft,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });

        clearTimeout(this.#scrollTimeout);

        // Update pagination immediately for instant scroll, or after animation for smooth scroll
        const updateDelay = prefersReducedMotion ? 0 : 300;

        this.#scrollTimeout = setTimeout(() => {
            this.#updatePagination(trackElement, pageIndex);
            // Clear navigation flag after update completes
            trackElement.isNavigating = false;
        }, updateDelay);
    }

    #navigateToNext(trackElement) {
        const newIndex = trackElement.currentPageIndex < trackElement.pages.length - 1
            ? trackElement.currentPageIndex + 1 : 0;
        this.#navigateToPage(trackElement, newIndex);
    }

    #navigateToPrev(trackElement) {
        const newIndex = trackElement.currentPageIndex > 0
            ? trackElement.currentPageIndex - 1
            : trackElement.pages.length - 1;
        this.#navigateToPage(trackElement, newIndex);
    }

    #getPeekingPadding(trackPanels) {
        const computedStyle = getComputedStyle(trackPanels);
        const panelPeeking = parseFloat(computedStyle.paddingLeft) || 0;  // Assume same for both sides
        return panelPeeking;
    }

    // Page Observer with adjusted rootMargin and threshold
    #observePages(trackElement, panelPeeking) {
        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;

        const pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const panelId = entry.target.id;
                    const pageIndex = trackElement.pages.findIndex(page =>
                        page.some(panel => panel.id === panelId)
                    );

                    const updateOnScrollEnd = () => {
                        // Skip observer updates during programmatic navigation
                        if (trackElement.isNavigating) {
                            return;
                        }
                        trackElement.currentPageIndex = pageIndex;
                        this.#updatePagination(trackElement, pageIndex);
                    };

                    if (pageIndex !== -1) {
                        // Remove existing scroll handler before adding new one
                        if (trackPanels.scrollHandler) {
                            const eventType = trackPanels.scrollEventType || 'scroll';
                            trackPanels.removeEventListener(eventType, trackPanels.scrollHandler);
                        }

                        // Use addEventListener instead of direct assignment
                        if ('onscrollend' in window) {
                            trackPanels.scrollEventType = 'scrollend';
                            trackPanels.scrollHandler = updateOnScrollEnd;
                            trackPanels.addEventListener('scrollend', updateOnScrollEnd);
                        } else {
                            const scrollHandler = () => {
                                clearTimeout(this.#scrollTimeout);
                                this.#scrollTimeout = setTimeout(updateOnScrollEnd, 250);
                            };
                            trackPanels.scrollEventType = 'scroll';
                            trackPanels.scrollHandler = scrollHandler;
                            trackPanels.addEventListener('scroll', scrollHandler);
                        }
                    }
                }
            });
        }, {
            root: trackPanels,
            threshold: 0.5,
            rootMargin: `0px -${panelPeeking * 0.5}px`,
        });

        trackElement.pages.forEach(page => {
            pageObserver.observe(page[0]);
        });

        trackElement.pageObserver = pageObserver; // Save for cleanup
    }

    // Tabbing Observer ensures only fully visible panels are tabbable
    #setupTabbingObserver(trackElement, panelPeeking) {
        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;

        const tabbingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const focusableElements = getFocusableElements(entry.target);  // Get all focusable elements in the panel

                // Set tabindex and aria-hidden based on visibility
                const isVisible = entry.isIntersecting;
                entry.target.setAttribute('aria-hidden', isVisible ? 'false' : 'true');  // Update aria-hidden

                focusableElements.forEach(el => {
                    el.setAttribute('tabindex', isVisible ? '0' : '-1');  // Enable or disable based on visibility
                });
            });
        }, {
            root: trackPanels,
            threshold: 0.5, // Only fully visible panels should be tabbable
            rootMargin: `0px -${panelPeeking}px`, // Simplified negative root margin for both sides
        });

        trackElement.pages.flat().forEach(panel => {
            tabbingObserver.observe(panel);
        });

        trackElement.tabbingObserver = tabbingObserver; // Save for cleanup
    }

    // Keyboard navigation with arrow keys - moves focus to appropriate button after navigation
    #initKeyboardNavigation(trackElement) {
        // Navigation buttons: arrow keys navigate carousel and move focus
        delegateEvent(trackElement, 'keydown', '[data-track-prev], [data-track-next]', (event) => {
            const prevButton = trackElement.querySelector('[data-track-prev]');
            const nextButton = trackElement.querySelector('[data-track-next]');

            if (event.code === 'ArrowRight') {
                event.preventDefault();
                this.#navigateToNext(trackElement);
                nextButton?.focus();
            } else if (event.code === 'ArrowLeft') {
                event.preventDefault();
                this.#navigateToPrev(trackElement);
                prevButton?.focus();
            }
        });

        // Panels: arrow keys move focus between visible panels only
        delegateEvent(trackElement, 'keydown', '.track__panel', (event) => {
            if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
                return;
            }

            // Always prevent default to stop arrow keys from doing unexpected things
            event.preventDefault();

            const currentPanel = event.target.closest('.track__panel');
            const currentPage = trackElement.pages[trackElement.currentPageIndex];
            const currentIndex = currentPage.indexOf(currentPanel);

            if (currentIndex === -1) return;

            let targetPanel = null;

            if (event.code === 'ArrowRight' && currentIndex < currentPage.length - 1) {
                targetPanel = currentPage[currentIndex + 1];
            } else if (event.code === 'ArrowLeft' && currentIndex > 0) {
                targetPanel = currentPage[currentIndex - 1];
            }

            // Only move focus if there's a valid target panel
            if (targetPanel) {
                const focusableElements = getFocusableElements(targetPanel);
                focusableElements[0]?.focus();
            }
        });
    }

    #setupResizeObserver(trackElement) {
        const resizeObserver = new ResizeObserver(() => {
            // Prevent infinite loops by checking if already resetting
            if (trackElement.isResetting) return;

            trackElement.isResetting = true;

            // Invalidate cache and recalculate
            this.#invalidateCache(trackElement);

            const cached = this.#getCachedElements(trackElement);
            const trackPanels = cached.panels;

            // Reset scroll position
            trackPanels.scrollLeft = 0;

            // Clear and rebuild pagination
            const paginationContainer = cached.pagination;
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }

            // Cleanup and recreate observers (except resize observer itself)
            if (trackElement.pageObserver) trackElement.pageObserver.disconnect();
            if (trackElement.tabbingObserver) trackElement.tabbingObserver.disconnect();

            // Remove scroll handler
            if (trackPanels.scrollHandler) {
                const eventType = trackPanels.scrollEventType || 'scroll';
                trackPanels.removeEventListener(eventType, trackPanels.scrollHandler);
                delete trackPanels.scrollHandler;
                delete trackPanels.scrollEventType;
            }

            trackElement.currentPageIndex = 0;

            const panelPeeking = this.#getPeekingPadding(trackPanels);

            this.#setupPagination(trackElement);
            this.#observePages(trackElement, panelPeeking);
            this.#setupTabbingObserver(trackElement, panelPeeking);

            trackElement.isResetting = false;
        });

        resizeObserver.observe(trackElement);
        trackElement.resizeObserver = resizeObserver;
    }

    #resetTrackState(trackElement) {
        // Invalidate cache since we're resetting
        this.#invalidateCache(trackElement);

        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;
        const paginationContainer = cached.pagination;

        // Reset scroll position
        trackPanels.scrollLeft = 0;

        // Clear pagination content
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        // Cleanup observers
        if (trackElement.pageObserver) trackElement.pageObserver.disconnect();
        if (trackElement.tabbingObserver) trackElement.tabbingObserver.disconnect();

        // Remove scroll handler
        if (trackPanels.scrollHandler) {
            const eventType = trackPanels.scrollEventType || 'scroll';
            trackPanels.removeEventListener(eventType, trackPanels.scrollHandler);
            delete trackPanels.scrollHandler;
            delete trackPanels.scrollEventType;
        }

        trackElement.currentPageIndex = 0;

        // Compute peeking padding once for both observers
        const panelPeeking = this.#getPeekingPadding(trackPanels);

        // Reinitialize after reset
        this.#setupPagination(trackElement);
        this.#initLiveRegion(trackElement);
        this.#observePages(trackElement, panelPeeking); // Peeking observation
        this.#setupTabbingObserver(trackElement, panelPeeking); // Tabbing management
        this.#initKeyboardNavigation(trackElement);  // Add keyboard navigation

        // Set up resize observer only if it doesn't exist yet
        if (!trackElement.resizeObserver) {
            this.#setupResizeObserver(trackElement);
        }
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
            this.#navigateToPrev(trackElement);
        });

        delegateEvent(trackElement, 'click', '[data-track-next]', () => {
            this.#navigateToNext(trackElement);
        });
    }

    #initLiveRegion(trackElement) {
        const cached = this.#getCachedElements(trackElement);
        let liveRegion = cached.liveRegion;

        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.className = 'liveregion screen-reader-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            trackElement.appendChild(liveRegion);
            
            // Update cache with new live region
            this.#invalidateCache(trackElement);
        }
    }

    #updateLiveRegion(trackElement, activeIndex, totalPages) {
        const cached = this.#getCachedElements(trackElement);
        const liveRegion = cached.liveRegion;
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
        ['pageObserver', 'tabbingObserver', 'resizeObserver'].forEach(observer => {
            if (trackElement[observer]) trackElement[observer].disconnect();
        });

        // Clean up scroll handlers
        const cached = this.#getCachedElements(trackElement);
        const trackPanels = cached.panels;
        if (trackPanels?.scrollHandler) {
            const eventType = trackPanels.scrollEventType || 'scroll';
            trackPanels.removeEventListener(eventType, trackPanels.scrollHandler);
            delete trackPanels.scrollHandler;
            delete trackPanels.scrollEventType;
        }

        clearTimeout(this.#scrollTimeout);
    }
}
import { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import TrackPanel from './TrackPanel';
import ButtonIconOnly from '../button/ButtonIconOnly';
import TrackPagination from './TrackPagination';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';

const Track = (props) => {

  const {
    panels,
    ariaLabel,
    trackId,
    utilities = null,
    floatDirectionalButtons = true
  } = props;

  const componentClasses = classNames(
    'track',
    utilities
  );

  // State

  const [visiblePanels, setVisiblePanels] = useState(1);
  const [trackPages, setTrackPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Refs

  const trackRef = useRef(null);
  const trackPanelsRef = useRef(null);
  const liveRegionRef = useRef(null);
  const focusObserverRef = useRef(null);
  const paginationObserverRef = useRef(null);
  const panelRefs = useRef([]);
  const debounceTimeout = useRef(null); // Ref to manage the scroll debounce
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const currentPageIndexRef = useRef(0); // Track current page for keyboard navigation
  const trackPagesRef = useRef([]); // Track pages for keyboard navigation
  const isNavigatingRef = useRef(false); // Flag to prevent observer interference during programmatic navigation

  const getVisiblePanels = () => {
    return parseInt(getComputedStyle(trackRef.current).getPropertyValue('--visible-panels'), 10) || 1;
  };

  const getPeekingPadding = () => {
    const computedStyle = getComputedStyle(trackPanelsRef.current);
    const panelPeeking = parseFloat(computedStyle.paddingLeft) || 0; // Assume same for both sides
    return panelPeeking;
  };

  // Recalculate and set up pagination (grouping panels into pages)
  const setupPagination = () => {
    const visiblePanelsCount = getVisiblePanels();
    setVisiblePanels(visiblePanelsCount);

    const pages = [];
    let currentPage = [];

    panelRefs.current.forEach((panel, index) => {
      currentPage.push(panel);

      if (currentPage.length === visiblePanelsCount || index === panelRefs.current.length - 1) {
        pages.push([...currentPage]);
        currentPage = [];
      }
    });

    setTrackPages(pages); // Set the pages
    setCurrentPageIndex(0); // Reset to the first page
  };

  // Debounced function to set the current page index
  const debouncedSetPageIndex = (pageIndex) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      // Skip observer updates during programmatic navigation
      if (isNavigatingRef.current) {
        return;
      }
      setCurrentPageIndex(pageIndex);
      updateLiveRegion(pageIndex); // Update live region for screen readers
    }, 150);
  };

  // Observer to detect which panels are in the viewport (pagination control)
  const applyPaginationObserver = (panelPeeking) => {

    if (paginationObserverRef.current) {
      paginationObserverRef.current.disconnect(); // Disconnect previous observer if it exists
    }

    const observer = new IntersectionObserver((entries) => {
      const intersectingEntry = entries.find(entry => entry.isIntersecting);

      if (intersectingEntry) {
        const intersectingPanel = intersectingEntry.target;
        const pageIndex = parseInt(intersectingPanel.getAttribute('data-page'), 10);

        console.log('Intersecting Panel:', intersectingPanel, 'Page Index:', pageIndex);
        debouncedSetPageIndex(pageIndex); // Set page index only if it has changed
      }
    }, {
      root: trackPanelsRef.current,
      threshold: 0.5, // Panels are considered visible when 50% or more is visible
      rootMargin: `0px -${panelPeeking * 0.5}px`,
    });

    panelRefs.current.forEach((panel) => {
      observer.observe(panel); // Attach the observer to each panel
    });

    paginationObserverRef.current = observer; // Store the observer for cleanup
  };

  // Observer for managing focusable elements (accessibility)

  const applyFocusObserver = (panelPeeking) => {

    if (focusObserverRef.current) {
      focusObserverRef.current.disconnect(); // Disconnect previous observer if it exists
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const focusableElements = getFocusableElements(entry.target);
        const isVisible = entry.isIntersecting;

        entry.target.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

        focusableElements.forEach((el) => {
          el.setAttribute('tabindex', isVisible ? '0' : '-1'); // Make focusable or not
        });
      });
    }, {
      root: trackPanelsRef.current,
      threshold: 0.5,
      rootMargin: `0px -${panelPeeking}px`,
    });

    Array.from(trackPanelsRef.current.children).forEach((panel) => observer.observe(panel));
    focusObserverRef.current = observer; // Store observer for cleanup
  };

  // Reset track state (on resize, etc.)
  const resetTrackState = () => {
    const panelPeeking = getPeekingPadding();
    trackPanelsRef.current.scrollLeft = 0; // Reset the scroll position to start
    setupPagination(); // Recalculate the pages

    applyPaginationObserver(panelPeeking);
    applyFocusObserver(panelPeeking);
  };

  // Scroll to a specific page
  const navigateToPage = (pageIndex) => {
    const targetPanel = trackPagesRef.current[pageIndex]?.[0];
    if (!targetPanel) return;

    currentPageIndexRef.current = pageIndex;
    isNavigatingRef.current = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    trackPanelsRef.current.scrollTo({
      left: targetPanel.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    setCurrentPageIndex(pageIndex);

    clearTimeout(debounceTimeout.current);
    const updateDelay = prefersReducedMotion ? 0 : 300;
    debounceTimeout.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, updateDelay);
  };

  // Update the live region for screen readers
  const updateLiveRegion = (pageIndex) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Page ${pageIndex + 1} of ${trackPages.length}`;
    }
  };

  // Keyboard navigation
  const initKeyboardNavigation = () => {
    const handleKeyDown = (event) => {
      // Navigation buttons: arrow keys navigate carousel and move focus
      const target = event.target;
      const button = target.closest('button');
      const isPrevButton = button?.classList.contains('track__prev');
      const isNextButton = button?.classList.contains('track__next');

      if (isPrevButton || isNextButton) {
        if (event.code === 'ArrowRight') {
          event.preventDefault();
          const newIndex = (currentPageIndexRef.current + 1) % trackPagesRef.current.length;
          navigateToPage(newIndex);
          nextButtonRef.current?.focus();
        } else if (event.code === 'ArrowLeft') {
          event.preventDefault();
          const newIndex = (currentPageIndexRef.current - 1 + trackPagesRef.current.length) % trackPagesRef.current.length;
          navigateToPage(newIndex);
          prevButtonRef.current?.focus();
        }
      }

      // Panels: arrow keys move focus between visible panels only
      const currentPanel = target.closest('.track__panel');
      if (currentPanel && (event.code === 'ArrowRight' || event.code === 'ArrowLeft')) {
        event.preventDefault();

        const currentPage = trackPagesRef.current[currentPageIndexRef.current];
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
      }
    };

    trackRef.current?.addEventListener('keydown', handleKeyDown);
    return () => trackRef.current?.removeEventListener('keydown', handleKeyDown);
  };

  // Keep refs in sync with state
  useEffect(() => {
    currentPageIndexRef.current = currentPageIndex;
  }, [currentPageIndex]);

  useEffect(() => {
    trackPagesRef.current = trackPages;
  }, [trackPages]);

  // Initialize
  useEffect(() => {
    setupPagination();
    const panelPeeking = getPeekingPadding();

    applyPaginationObserver(panelPeeking);
    applyFocusObserver(panelPeeking);

    const cleanupKeyboardNav = initKeyboardNavigation();

    window.addEventListener('resize', resetTrackState);

    return () => {
      window.removeEventListener('resize', resetTrackState);

      if (focusObserverRef.current) focusObserverRef.current.disconnect();
      if (paginationObserverRef.current) paginationObserverRef.current.disconnect();

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Cleanup debounce timeout
      }

      cleanupKeyboardNav();
    };
  }, [panels]);

  return (
    <div className="margin-y-6">

      <section
        className={componentClasses}
        aria-labelledby={`${trackId}-heading`}
        ref={trackRef}>

        <h3 id={`${trackId}-heading`} className="screen-reader-only">
          {ariaLabel}
        </h3>

        {floatDirectionalButtons && (
          <>
            <div className="track__container">

              <ButtonIconOnly
                ref={prevButtonRef}
                ariaLabel="Previous Slide"
                iconHandle="arrow-left"
                clickHandler={() => {
                  const newIndex = (currentPageIndexRef.current - 1 + trackPagesRef.current.length) % trackPagesRef.current.length;
                  navigateToPage(newIndex);
                }}
                utilities="theme-canvas track__prev"
              />

              <ul className="track__panels gap-1" ref={trackPanelsRef}>
                {panels.map((panel, index) => {
                  const pageIndex = Math.floor(index / visiblePanels); // Calculate the page index
                  return (
                    <li
                      ref={(el) => (panelRefs.current[index] = el)}
                      key={`${trackId}-panel-${index}`}
                      data-index={index}         // Panel index for debugging or other uses
                      data-page={pageIndex}      // Assign the page index directly to the panel
                      className="track__panel"
                    >
                      <TrackPanel panel={panel} />
                    </li>
                  );
                })}
              </ul>

              <ButtonIconOnly
                ref={nextButtonRef}
                ariaLabel="Next Slide"
                iconHandle="arrow-right"
                clickHandler={() => {
                  const newIndex = (currentPageIndexRef.current + 1) % trackPagesRef.current.length;
                  navigateToPage(newIndex);
                }}
                utilities="theme-canvas track__next"
              />

            </div>

            <TrackPagination
              currentPageIndex={currentPageIndex}
              totalPages={trackPages.length}
              onNavigate={navigateToPage}
            />

          </>
        )}

        <div
          ref={liveRegionRef}
          className="liveregion screen-reader-only"
          aria-live="polite"
          aria-atomic="true"
        />

      </section>

    </div>

  );
};

export default Track;

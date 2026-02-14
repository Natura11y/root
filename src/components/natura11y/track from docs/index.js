import React, { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import TrackPanel from './TrackPanel';
import ButtonIconOnly from '../button/ButtonIconOnly';
import TrackPagination from './TrackPagination';

import { getFocusableElements } from '../../../utilities/focus';

const Track = (props) => {

  const {
    panels,
    ariaLabel,
    trackId,
    peeking = false,
    utilities = null,
    floatDirectionalButtons = true 
  } = props;

  const componentClasses = classNames(
    'track',
    {
      'track--peeking': peeking,
      [`${utilities}`]: utilities,
    }
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

  const getVisiblePanels = () => {
    return parseInt(getComputedStyle(trackRef.current).getPropertyValue('--visible-panels'), 10) || 1;
  };

  const getPeekingPadding = () => {
    const computedStyle = getComputedStyle(trackPanelsRef.current);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    return { paddingLeft, paddingRight };
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
      setCurrentPageIndex(pageIndex);
      updateLiveRegion(pageIndex); // Update live region for screen readers
    }, 150);
  };

  // Observer to detect which panels are in the viewport (pagination control)
  const applyPaginationObserver = (paddingLeft, paddingRight) => {

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
      rootMargin: `0px -${paddingLeft * 0.5}px 0px -${paddingRight * 0.5}px`,
    });

    panelRefs.current.forEach((panel) => {
      observer.observe(panel); // Attach the observer to each panel
    });

    paginationObserverRef.current = observer; // Store the observer for cleanup
  };

  // Observer for managing focusable elements (accessibility)

  const applyFocusObserver = (paddingLeft, paddingRight) => {

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
      rootMargin: `0px -${paddingLeft}px 0px -${paddingRight}px`,
    });

    Array.from(trackPanelsRef.current.children).forEach((panel) => observer.observe(panel));
    focusObserverRef.current = observer; // Store observer for cleanup
  };

  // Reset track state (on resize, etc.)
  const resetTrackState = () => {
    const { paddingLeft, paddingRight } = getPeekingPadding();
    trackPanelsRef.current.scrollLeft = 0; // Reset the scroll position to start
    setupPagination(); // Recalculate the pages

    applyPaginationObserver(paddingLeft, paddingRight);
    applyFocusObserver(paddingLeft, paddingRight);
  };

  // Scroll to a specific page
  const navigateToPage = (pageIndex) => {
    const totalPages = trackPages.length;
    console.log('Total Pages:', totalPages);

    const targetPanel = trackPanelsRef.current.children[pageIndex * visiblePanels];
    trackPanelsRef.current.scrollTo({
      left: targetPanel.offsetLeft,
      behavior: 'smooth',
    });

    setCurrentPageIndex(pageIndex); // Safely update the current page index
  };

  // Update the live region for screen readers
  const updateLiveRegion = (pageIndex) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Page ${pageIndex + 1} of ${trackPages.length}`;
    }
  };

  // Initialize
  useEffect(() => {
    setupPagination();
    const { paddingLeft, paddingRight } = getPeekingPadding();
    
    applyPaginationObserver(paddingLeft, paddingRight);
    applyFocusObserver(paddingLeft, paddingRight);

    window.addEventListener('resize', resetTrackState);

    return () => {
      window.removeEventListener('resize', resetTrackState);

      if (focusObserverRef.current) focusObserverRef.current.disconnect();
      if (paginationObserverRef.current) paginationObserverRef.current.disconnect();

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Cleanup debounce timeout
      }
    };
  }, [panels]);

  return (
    <div className="margin-y-6">

      <section
        className={componentClasses}
        aria-labelledby={ariaLabel}
        ref={trackRef}>

        <h3 id={ariaLabel} className="screen-reader-only">{ariaLabel}</h3>

        {floatDirectionalButtons && (
          <>
            <div className="track__container">

              <ButtonIconOnly
                ariaLabel="Previous Slide"
                iconHandle="arrow-left"
                clickHandler={navigateToPage.bind(null, (currentPageIndex - 1 + trackPages.length) % trackPages.length)}
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
                ariaLabel="Next Slide"
                iconHandle="arrow-right"
                clickHandler={navigateToPage.bind(null, (currentPageIndex + 1) % trackPages.length)}
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
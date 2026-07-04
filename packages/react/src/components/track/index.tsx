import { useState, useEffect, useRef, useId, type ComponentType } from 'react';
import classNames from 'classnames';
import TrackPanel from './TrackPanel';
import ButtonIconOnly from '../button/ButtonIconOnly';
import TrackPagination from './TrackPagination';
import { getFocusableElements } from '@natura11y/core/utilities/focus';

interface PaginationProps {
  currentPageIndex: number;
  totalPages: number;
  onNavigate: (index: number) => void;
}

interface TrackProps {
  panels: Record<string, unknown>[];
  ariaLabel: string;
  trackId?: string | null;
  utilities?: string | null;
  floatDirectionalButtons?: boolean;
  PanelComponent?: ComponentType<{ panel: Record<string, unknown> }>;
  PaginationComponent?: ComponentType<PaginationProps>;
}

const Track = ({
  panels,
  ariaLabel,
  trackId: trackIdProp = null,
  utilities = null,
  floatDirectionalButtons = true,
  PanelComponent = TrackPanel as unknown as ComponentType<{ panel: Record<string, unknown> }>,
  PaginationComponent = TrackPagination,
}: TrackProps) => {
  const generatedId = useId();
  const trackId = trackIdProp ?? generatedId;

  const trackClasses = classNames('track', utilities);

  const [visiblePanels, setVisiblePanels] = useState(1);
  const [trackPages, setTrackPages] = useState<HTMLLIElement[][]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const trackRef = useRef<HTMLElement>(null);
  const trackPanelsRef = useRef<HTMLUListElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const tabbingObserverRef = useRef<IntersectionObserver | null>(null);
  const paginationObserverRef = useRef<IntersectionObserver | null>(null);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const currentPageIndexRef = useRef(0);
  const trackPagesRef = useRef<HTMLLIElement[][]>([]);
  const isNavigatingRef = useRef(false);

  const getVisiblePanels = () => {
    if (!trackRef.current) return 1;
    return parseInt(getComputedStyle(trackRef.current).getPropertyValue('--_visible-panels'), 10) || 1;
  };

  const getPeekingPadding = () => {
    if (!trackPanelsRef.current) return 0;
    return parseFloat(getComputedStyle(trackPanelsRef.current).paddingLeft) || 0;
  };

  const setupPagination = () => {
    const visiblePanelsCount = getVisiblePanels();
    setVisiblePanels(visiblePanelsCount);

    const pages: HTMLLIElement[][] = [];
    let currentPage: HTMLLIElement[] = [];

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      currentPage.push(panel);
      if (currentPage.length === visiblePanelsCount || index === panelRefs.current.length - 1) {
        pages.push([...currentPage]);
        currentPage = [];
      }
    });

    setTrackPages(pages);
    setCurrentPageIndex(0);
  };

  const debouncedSetPageIndex = (pageIndex: number) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (isNavigatingRef.current) return;
      setCurrentPageIndex(pageIndex);
      updateLiveRegion(pageIndex);
    }, 150);
  };

  const applyPaginationObserver = (panelPeeking: number) => {
    if (!trackPanelsRef.current) return;
    if (paginationObserverRef.current) paginationObserverRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        const pageIndex = parseInt(intersectingEntry.target.getAttribute('data-page') ?? '0', 10);
        debouncedSetPageIndex(pageIndex);
      }
    }, {
      root: trackPanelsRef.current,
      threshold: 0.5,
      rootMargin: `0px -${panelPeeking * 0.5}px`,
    });

    panelRefs.current.forEach(panel => { if (panel) observer.observe(panel); });
    paginationObserverRef.current = observer;
  };

  const applyTabbingObserver = (panelPeeking: number) => {
    if (!trackPanelsRef.current) return;
    if (tabbingObserverRef.current) tabbingObserverRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.toggleAttribute('inert', !entry.isIntersecting);
      });
    }, {
      root: trackPanelsRef.current,
      threshold: 0.5,
      rootMargin: `0px -${panelPeeking}px`,
    });

    Array.from(trackPanelsRef.current.children).forEach(panel => observer.observe(panel));
    tabbingObserverRef.current = observer;
  };

  const resetTrackState = () => {
    if (!trackPanelsRef.current) return;
    const panelPeeking = getPeekingPadding();
    trackPanelsRef.current.scrollLeft = 0;
    setupPagination();
    applyPaginationObserver(panelPeeking);
    applyTabbingObserver(panelPeeking);
  };

  const navigateToPage = (pageIndex: number) => {
    const targetPanel = trackPagesRef.current[pageIndex]?.[0];
    if (!targetPanel || !trackPanelsRef.current) return;

    currentPageIndexRef.current = pageIndex;
    isNavigatingRef.current = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    trackPanelsRef.current.scrollTo({
      left: targetPanel.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    setCurrentPageIndex(pageIndex);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, prefersReducedMotion ? 0 : 300);
  };

  const updateLiveRegion = (pageIndex: number) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Page ${pageIndex + 1} of ${trackPagesRef.current.length}`;
    }
  };

  const initKeyboardNavigation = () => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const button = (event.target as HTMLElement).closest('button');
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

      const currentPanel = (event.target as HTMLElement).closest('.track__panel') as HTMLLIElement | null;
      if (currentPanel && (event.code === 'ArrowRight' || event.code === 'ArrowLeft')) {
        event.preventDefault();

        const currentPage = trackPagesRef.current[currentPageIndexRef.current];
        if (!currentPage) return;
        const currentIndex = currentPage.indexOf(currentPanel);
        if (currentIndex === -1) return;

        let targetPanel: HTMLLIElement | null = null;
        if (event.code === 'ArrowRight' && currentIndex < currentPage.length - 1) {
          targetPanel = currentPage[currentIndex + 1] ?? null;
        } else if (event.code === 'ArrowLeft' && currentIndex > 0) {
          targetPanel = currentPage[currentIndex - 1] ?? null;
        }

        if (targetPanel) {
          (getFocusableElements(targetPanel)[0] as HTMLElement | undefined)?.focus();
        }
      }
    };

    trackRef.current?.addEventListener('keydown', handleKeyDown);
    return () => trackRef.current?.removeEventListener('keydown', handleKeyDown);
  };

  useEffect(() => {
    currentPageIndexRef.current = currentPageIndex;
    trackPagesRef.current = trackPages;
  }, [currentPageIndex, trackPages]);

  useEffect(() => {
    setupPagination();
    const panelPeeking = getPeekingPadding();
    applyPaginationObserver(panelPeeking);
    applyTabbingObserver(panelPeeking);
    const cleanupKeyboardNav = initKeyboardNavigation();
    window.addEventListener('resize', resetTrackState);

    return () => {
      window.removeEventListener('resize', resetTrackState);
      if (tabbingObserverRef.current) tabbingObserverRef.current.disconnect();
      if (paginationObserverRef.current) paginationObserverRef.current.disconnect();
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      cleanupKeyboardNav();
    };
  }, [panels]); // eslint-disable-line react-hooks/exhaustive-deps

  const panelList = (
    <ul className="track__panels gap-1" ref={trackPanelsRef}>
      {panels.map((panel, index) => {
        const pageIndex = Math.floor(index / visiblePanels);
        return (
          <li
            ref={(el) => { panelRefs.current[index] = el; }}
            key={`${trackId}-panel-${index}`}
            data-index={index}
            data-page={pageIndex}
            className="track__panel"
          >
            <PanelComponent panel={panel} />
          </li>
        );
      })}
    </ul>
  );

  return (
    <section
      className={trackClasses}
      aria-labelledby={`${trackId}-heading`}
      ref={trackRef}
    >
      <h3 id={`${trackId}-heading`} className="screen-reader-only">
        {ariaLabel}
      </h3>

      {floatDirectionalButtons ? (
        <>
          <div className="track__container">
            <ButtonIconOnly
              ref={prevButtonRef}
              ariaLabel="Previous Slide"
              iconHandle="arrow-left"
              onClick={() => {
                const newIndex = (currentPageIndexRef.current - 1 + trackPagesRef.current.length) % trackPagesRef.current.length;
                navigateToPage(newIndex);
              }}
              utilities="track__prev"
            />
            {panelList}
            <ButtonIconOnly
              ref={nextButtonRef}
              ariaLabel="Next Slide"
              iconHandle="arrow-right"
              onClick={() => {
                const newIndex = (currentPageIndexRef.current + 1) % trackPagesRef.current.length;
                navigateToPage(newIndex);
              }}
              utilities="track__next"
            />
          </div>
          <PaginationComponent
            currentPageIndex={currentPageIndex}
            totalPages={trackPages.length}
            onNavigate={navigateToPage}
          />
        </>
      ) : (
        <>
          <div className="track__container">
            {panelList}
          </div>
          <div className="track__controls">
            <PaginationComponent
              currentPageIndex={currentPageIndex}
              totalPages={trackPages.length}
              onNavigate={navigateToPage}
            />
            <ButtonIconOnly
              ref={prevButtonRef}
              ariaLabel="Previous Slide"
              iconHandle="arrow-left"
              onClick={() => {
                const newIndex = (currentPageIndexRef.current - 1 + trackPagesRef.current.length) % trackPagesRef.current.length;
                navigateToPage(newIndex);
              }}
              utilities="track__prev"
            />
            <ButtonIconOnly
              ref={nextButtonRef}
              ariaLabel="Next Slide"
              iconHandle="arrow-right"
              onClick={() => {
                const newIndex = (currentPageIndexRef.current + 1) % trackPagesRef.current.length;
                navigateToPage(newIndex);
              }}
              utilities="track__next"
            />
          </div>
        </>
      )}

      <div
        ref={liveRegionRef}
        className="liveregion screen-reader-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </section>
  );
};

export default Track;
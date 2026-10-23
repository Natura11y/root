import { useLayoutEffect, useState, type KeyboardEvent, type RefObject } from 'react';
import { getFocusableElements } from '@natura11y/core/utilities/focus';
import { useStableCallback } from './useStableCallback';

interface UseCollapseOptions {
  panelRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose?: (() => void) | null;
  focusOnOpen?: 'first' | 'panel' | null;
  triggerRef?: RefObject<HTMLElement | null>;
  showAt?: string | null;
  alwaysVisible?: boolean;
}

// Shared internally by Collapse and Main Menu; each caller owns its open state.
export function useCollapse({
  panelRef,
  isOpen,
  onClose,
  focusOnOpen = null,
  triggerRef,
  showAt = null,
  alwaysVisible = false,
}: UseCollapseOptions) {
  const [isShownAtBreakpoint, setIsShownAtBreakpoint] = useState(false);
  const isVisible = isOpen || isShownAtBreakpoint || alwaysVisible;

  useLayoutEffect(() => {
    // Core emits these values from the same Sass map as its responsive styles.
    const breakpoint = showAt
      ? getComputedStyle(document.documentElement).getPropertyValue(`--bp-${showAt}`).trim()
      : '';

    if (!breakpoint) {
      setIsShownAtBreakpoint(false);
      return;
    }

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint})`);
    const updateVisibility = () => setIsShownAtBreakpoint(mediaQuery.matches);

    updateVisibility();
    mediaQuery.addEventListener('change', updateVisibility);

    return () => mediaQuery.removeEventListener('change', updateVisibility);
  }, [showAt]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let cancelled = false;
    let addedTabIndex = false;

    if (isOpen) {
      panel.setAttribute('data-active', '');
      panel.classList.add('shown');

      if (focusOnOpen) {
        const firstFocusable = focusOnOpen === 'first' ? getFocusableElements(panel)[0] : null;
        const focusTarget = firstFocusable ?? panel;

        if (focusTarget === panel && !panel.hasAttribute('tabindex')) {
          panel.tabIndex = -1;
          addedTabIndex = true;
        }

        focusTarget.focus();
      }
    } else {
      panel.classList.remove('shown');

      const finishClosing = () => {
        if (cancelled) return;

        const transitions = panel.getAnimations().filter((animation) =>
          animation instanceof CSSTransition
          && ['height', 'grid-template-rows', 'visibility'].includes(animation.transitionProperty)
          && animation.playState !== 'finished'
        );

        if (transitions.length) {
          Promise.allSettled(transitions.map((animation) => animation.finished)).then(finishClosing);
          return;
        }

        panel.removeAttribute('data-active');
      };

      finishClosing();
    }

    return () => {
      // A reopening or unmount must cancel work left by an earlier close.
      cancelled = true;
      if (addedTabIndex) panel.removeAttribute('tabindex');
    };
  }, [isOpen, panelRef, focusOnOpen]);

  const onKeyDown = useStableCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !isOpen || !onClose) return;
    if (isShownAtBreakpoint || alwaysVisible) return;

    event.preventDefault();
    onClose();

    const trigger = triggerRef?.current;
    if (trigger && trigger.getClientRects().length && getComputedStyle(trigger).visibility === 'visible') {
      trigger.focus();
    }
  });

  return { isVisible, onKeyDown };
}

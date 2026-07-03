import { useEffect } from 'react';

// Module-level lock count so nested overlays (e.g. Modal inside Flyout)
// don't fight over scroll state. Only the first lock captures the original
// styles; only the last unlock restores them.
let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Locks document scroll when `enabled` is true.
 * Compensates for scrollbar width to prevent layout shift.
 * Safe for nested overlays — uses a reference counter internally.
 */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    lockCount++;

    if (lockCount === 1) {
      const html = document.documentElement;
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      originalOverflow = html.style.overflow;
      originalPaddingRight = html.style.paddingRight;

      html.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        const currentPadding = parseFloat(getComputedStyle(html).paddingRight) || 0;
        html.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
    }

    return () => {
      lockCount--;

      if (lockCount === 0) {
        const html = document.documentElement;
        html.style.overflow = originalOverflow;
        html.style.paddingRight = originalPaddingRight;
      }
    };
  }, [enabled]);
}

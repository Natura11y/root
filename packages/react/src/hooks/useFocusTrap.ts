import { useEffect, type RefObject } from 'react';
import { getFocusableElements } from '@natura11y/core/utilities/focus';
import { useStableCallback } from './useStableCallback';

/**
 * Traps focus within a container element while `enabled` is true.
 * Tab and Shift+Tab cycle through focusable elements inside the container.
 * Calls `onEscape` when the Escape key is pressed.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  options: {
    enabled: boolean;
    onEscape?: () => void;
  }
): void {
  const { enabled } = options;
  const onEscape = useStableCallback(options.onEscape);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.key === 'Escape') {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, containerRef, onEscape]);
}

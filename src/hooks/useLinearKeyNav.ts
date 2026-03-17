import { type KeyboardEvent, type RefObject } from 'react';
import { useStableCallback } from './useStableCallback';

/**
 * Returns an `onKeyDown` handler for linear (1D) keyboard navigation.
 * Arrow keys, Home, and End move focus through elements matching `itemSelector`
 * inside the container.
 */
export function useLinearKeyNav(options: {
  containerRef: RefObject<HTMLElement | null>;
  itemSelector: string;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
}): { onKeyDown: (e: KeyboardEvent) => void } {
  const {
    containerRef,
    itemSelector,
    orientation = 'both',
    loop = true,
  } = options;

  const onKeyDown = useStableCallback((e: KeyboardEvent) => {
    if (!containerRef.current) return;

    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(itemSelector)
    );
    const index = items.indexOf(e.target as HTMLElement);
    if (index === -1) return;

    const goTo = (next: number) => {
      e.preventDefault();
      items[next]?.focus();
    };

    switch (e.key) {
      case 'Home':
        goTo(0);
        break;
      case 'End':
        goTo(items.length - 1);
        break;
      case 'ArrowLeft':
        if (orientation === 'vertical') return;
        goTo(loop ? (index - 1 + items.length) % items.length : Math.max(0, index - 1));
        break;
      case 'ArrowRight':
        if (orientation === 'vertical') return;
        goTo(loop ? (index + 1) % items.length : Math.min(items.length - 1, index + 1));
        break;
      case 'ArrowUp':
        if (orientation === 'horizontal') return;
        goTo(loop ? (index - 1 + items.length) % items.length : Math.max(0, index - 1));
        break;
      case 'ArrowDown':
        if (orientation === 'horizontal') return;
        goTo(loop ? (index + 1) % items.length : Math.min(items.length - 1, index + 1));
        break;
    }
  });

  return { onKeyDown };
}

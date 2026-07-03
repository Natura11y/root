// Type declarations for natura11y framework JS utilities.
// These are plain JS modules with no bundled types.

declare module '@natura11y/core/utilities/focus' {
  export function getFocusableElements(
    element: HTMLElement | null,
    options?: Record<string, unknown>
  ): HTMLElement[];

  export function focusTrap(
    element: HTMLElement,
    firstFocusTarget?: HTMLElement | null
  ): () => void;
}

declare module '@natura11y/core/utilities/keyboardNavigation' {
  export function handleArrowKeyNavigation(
    event: KeyboardEvent,
    currentIndex: number,
    itemList: HTMLElement[],
    callback: (index: number) => void
  ): void;
}

declare module '@natura11y/core/utilities/getCurrentBreakpoint' {
  export function getCurrentBreakpoint(): {
    value: string;
    isDesktop: boolean;
    isMobile: boolean;
  };
}

import { useLayoutEffect, useRef } from 'react';

type InitializedExample = {
  container: HTMLDivElement;
  html: string;
};

const initializedExamples = new Map<string, InitializedExample>();

type VanillaExampleProps = {
  html: string;
  initialize?: (container: HTMLDivElement) => void | (() => void);
  initializeOnceKey?: string;
};

const VanillaExample = ({ html, initialize, initializeOnceKey }: VanillaExampleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (initializeOnceKey) {
      const initializedExample = initializedExamples.get(initializeOnceKey);

      const sameLiveContainer =
        initializedExample?.container === container &&
        document.contains(container);

      const sameHtml = initializedExample?.html === html;

      if (sameLiveContainer && sameHtml) return;

      initializedExamples.set(initializeOnceKey, {
        container,
        html,
      });
    }

    // Keep the vanilla DOM intact when Storybook rerenders for viewport or theme changes.
    container.innerHTML = html;
    const cleanup = initialize?.(container);

    if (typeof cleanup !== 'function') return;

    return () => {
      cleanup();

      if (initializeOnceKey && initializedExamples.get(initializeOnceKey)?.container === container) {
        initializedExamples.delete(initializeOnceKey);
      }
    };
  }, [initialize, html, initializeOnceKey]);

  return (
    <div ref={containerRef} />
  );
};

export default VanillaExample;

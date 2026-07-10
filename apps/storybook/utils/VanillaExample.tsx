import { useEffect, useRef } from 'react';

type InitializedExample = {
  container: HTMLDivElement;
  html: string;
};

const initializedExamples = new Map<string, InitializedExample>();

type VanillaExampleProps = {
  html: string;
  initialize?: (container: HTMLDivElement) => void;
  initializeOnceKey?: string;
};

const VanillaExample = ({ html, initialize, initializeOnceKey }: VanillaExampleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    initialize?.(container);
  }, [initialize, html, initializeOnceKey]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default VanillaExample;

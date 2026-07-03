import { useEffect, useRef } from 'react';

const initializedExamples = new Set<string>();

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
      if (initializedExamples.has(initializeOnceKey)) return;
      initializedExamples.add(initializeOnceKey);
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
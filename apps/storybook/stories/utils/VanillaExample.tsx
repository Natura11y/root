import { useEffect, useRef } from 'react';

const initializedExamples = new Set<string>();

type VanillaExampleProps = {
  html: string;
  initialize?: () => void;
  initializeOnceKey?: string;
};

const VanillaExample = ({ html, initialize, initializeOnceKey }: VanillaExampleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initializeOnceKey) {
      if (initializedExamples.has(initializeOnceKey)) return;
      initializedExamples.add(initializeOnceKey);
    }

    initialize?.();
  }, [initialize, html, initializeOnceKey]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default VanillaExample;

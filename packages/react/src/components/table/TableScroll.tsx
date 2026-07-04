import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

interface TableScrollProps {
  children?: ReactNode;
}

const TableScroll = ({ children }: TableScrollProps) => {
  const [scrollable, setScrollable] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollElement = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef<HTMLDivElement>(null);

  const checkWidths = useCallback(() => {
    if (!scrollElement.current || !scrollTarget.current) return;
    setScrollable(scrollTarget.current.scrollWidth > scrollElement.current.offsetWidth);
  }, []);

  useEffect(() => {
    checkWidths();
    window.addEventListener('resize', checkWidths);
    return () => window.removeEventListener('resize', checkWidths);
  }, [checkWidths]);

  const scrollHandler = () => {
    if (!scrollTarget.current) return;
    setIsScrolling(scrollTarget.current.scrollLeft > 1);
  };

  return (
    <div ref={scrollElement} className='table-scroll' data-scroll={scrollable}>
      <small className='table-scroll__help'>Scroll to see whole table</small>
      <div
        ref={scrollTarget}
        className='table-scroll__container'
        data-scrolling={isScrolling}
        onScroll={scrollHandler}
      >
        {children}
      </div>
    </div>
  );
};

export default TableScroll;
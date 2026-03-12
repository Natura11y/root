import { useRef, useState, useEffect, useCallback } from 'react';

const TableScroll = ({ children }) => {

    const [scrollable, setScrollable] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollElement = useRef();
    const scrollTarget = useRef();

    const checkWidths = useCallback(() => {
        const maxWidth = scrollElement.current.offsetWidth;
        const scrollWidth = scrollTarget.current.scrollWidth;
        setScrollable(scrollWidth > maxWidth);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', checkWidths);
        return () => window.removeEventListener('resize', checkWidths);
    }, [checkWidths]);

    useEffect(() => {
        checkWidths();
    }, [checkWidths]);

    const scrollHandler = () => {
        setIsScrolling(scrollTarget.current.scrollLeft > 1);
    };

    return (
        <div
            ref={scrollElement}
            className='table-scroll'
            data-scroll={scrollable}
        >
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

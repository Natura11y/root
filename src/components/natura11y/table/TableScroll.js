import { forwardRef, useRef, useState, useEffect, useCallback } from 'react';

import Table from './';

const TableScroll = forwardRef((props, ref) => {

    const { tableCaption = 'Table Caption' } = props;

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

        return () => {
            window.removeEventListener('resize', checkWidths);
        };
    }, [checkWidths]);

    useEffect(() => {
        checkWidths();
    }, [checkWidths]);

    const scrollHandler = () => {
        const scrollPosition = scrollTarget.current.scrollLeft;
        setIsScrolling(scrollPosition > 1);
    }

    return (
        <div
            ref={scrollElement}
            className='table-scroll'
            data-scroll={scrollable ? true : false}
        >
            <small className='table-scroll__help'>Scroll to see whole table</small>
            <div
                ref={scrollTarget}
                className='table-scroll__container'
                data-scrolling={isScrolling ? true : false}
                onScroll={scrollHandler}
            >
                <Table />
            </div>
        </div>
    );
});

export default TableScroll;
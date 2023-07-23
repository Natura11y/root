import React, { useRef, useState, useEffect } from 'react';

import Table from './Table';

const TableScroll = ( props ) => {

    const {
        tableCaption = 'Table Caption'
    } = props;

    const [scrollable, setScrollable] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollElement = useRef();
    const scrollTarget = useRef();

    let maxWidth;
    let scrollWidth;

    const checkWidths = () =>{
    
        maxWidth = scrollElement.current.offsetWidth;
        scrollWidth = scrollTarget.current.scrollWidth;

        scrollWidth > maxWidth
            ? setScrollable(true)
            : setScrollable(false);
    }

    useEffect(() => {

        window.addEventListener('resize', checkWidths);

        return () => {
            window.removeEventListener('click', checkWidths);
        }

    }, []);

    useEffect(() => {

        checkWidths();
    
    }, [scrollable]);

    const scrollHandler = () => {

        let scrollPosition = scrollTarget.current.scrollLeft;
        console.log(scrollPosition);

        scrollPosition > 1
            ? setIsScrolling(true)
            : setIsScrolling(false);
    }

	return (
		<div
            className='table-scroll'
            data-scroll={scrollable ? true : false}
            ref={scrollElement}
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
};

export default TableScroll;
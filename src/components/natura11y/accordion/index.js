import { useState, useRef, useCallback } from 'react';

import { AccordionContext } from './AccordionContext';
import AccordionItem from './AccordionItem';

const Accordion = ({ openDefault = null, headingLevel = null, children }) => {

	const [openAccordion, setOpenAccordion] = useState(openDefault);
	const accordionRef = useRef(null);

	const handleClick = useCallback((title) => {
		setOpenAccordion(prev => prev === title ? null : title);
	}, []);

	const handleKeyDown = useCallback((e) => {
		if (!accordionRef.current) return;

		const buttons = Array.from(accordionRef.current.querySelectorAll('[data-accordion="button"]'));
		const index = buttons.indexOf(e.target);

		if (index === -1) return;

		const navigate = (dir) => {
			e.preventDefault();
			let next = index + dir;
			if (next < 0) next = buttons.length - 1;
			if (next >= buttons.length) next = 0;
			buttons[next].focus();
		};

		switch (e.code) {
			case 'ArrowLeft':
			case 'ArrowUp':
				navigate(-1);
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				navigate(1);
				break;
			default:
				// do nothing
		}
	}, []);

	return (
		<AccordionContext.Provider value={{ openAccordion, headingLevel, handleClick, handleKeyDown }}>
			<div className='accordion' ref={accordionRef}>
				{children}
			</div>
		</AccordionContext.Provider>
	);

};

Accordion.Item = AccordionItem;

export default Accordion;

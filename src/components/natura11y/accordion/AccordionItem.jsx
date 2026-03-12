import { useContext, useId } from 'react';

import { AccordionContext } from './AccordionContext';

const AccordionItem = ({ title = 'Accordion Header', children }) => {

	const { openAccordion, headingLevel, handleClick, handleKeyDown } = useContext(AccordionContext);

	const id = useId();
	const isActive = openAccordion === title;
	const Heading = headingLevel ? `h${headingLevel}` : null;

	const button = (
		<button
			className='accordion__button h5'
			id={id}
			data-accordion='button'
			aria-controls={`acc-panel-${id}`}
			aria-expanded={isActive}
			onClick={() => handleClick(title)}
			onKeyDown={handleKeyDown}
		>
			<span className='text'>{title}</span>
		</button>
	);

	return (
		<>
			{Heading
				? <Heading data-accordion='heading'>{button}</Heading>
				: button
			}

			<div
				className={`accordion__panel${isActive ? ' shown' : ''}`}
				id={`acc-panel-${id}`}
				data-accordion='panel'
				aria-labelledby={id}
				inert={!isActive ? true : undefined}
				role='region'
			>
				<div className='accordion__panel__content'>
					{children}
				</div>
			</div>
		</>
	);

};

export default AccordionItem;

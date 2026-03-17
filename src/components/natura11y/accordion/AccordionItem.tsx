import { useId, type ElementType, type ReactNode } from 'react';
import { useAccordionContext } from './AccordionContext';

export interface AccordionItemProps {
  itemId?: string;
  title?: string;
  children?: ReactNode;
}

const AccordionItem = ({ itemId, title = 'Accordion Header', children }: AccordionItemProps) => {
  const { openAccordion, headingLevel, handleClick } = useAccordionContext();

  const generatedId = useId();
  const resolvedId = itemId ?? generatedId;
  const isActive = openAccordion === resolvedId;
  const Heading = headingLevel ? (`h${headingLevel}` as ElementType) : null;

  const button = (
    <button
      className='accordion__button h5'
      id={resolvedId}
      data-accordion='button'
      aria-controls={`acc-panel-${resolvedId}`}
      aria-expanded={isActive}
      onClick={() => handleClick(resolvedId)}
    >
      <span className='text'>{title}</span>
    </button>
  );

  return (
    <>
      {Heading ? <Heading data-accordion='heading'>{button}</Heading> : button}
      <div
        className={`accordion__panel${isActive ? ' shown' : ''}`}
        id={`acc-panel-${resolvedId}`}
        data-accordion='panel'
        aria-labelledby={resolvedId}
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
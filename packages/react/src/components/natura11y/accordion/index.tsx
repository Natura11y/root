import { useRef, type ReactNode } from 'react';
import { AccordionContext } from './AccordionContext';
import { useControlled } from '../../../hooks/useControlled';
import { useLinearKeyNav } from '../../../hooks/useLinearKeyNav';
import AccordionItem from './AccordionItem';

interface AccordionProps {
  defaultOpen?: string | null;
  open?: string | null;
  onOpenChange?: (id: string | null) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6 | null;
  children: ReactNode;
}

const Accordion = ({
  defaultOpen = null,
  open,
  onOpenChange,
  headingLevel = null,
  children,
}: AccordionProps) => {
  const accordionRef = useRef<HTMLDivElement>(null);

  const [openAccordion, setOpenAccordion] = useControlled({
    controlled: open,
    default: defaultOpen,
    name: 'Accordion',
    state: 'open',
  });

  const handleClick = (itemId: string) => {
    const next = openAccordion === itemId ? null : itemId;
    setOpenAccordion(next);
    onOpenChange?.(next);
  };

  const { onKeyDown } = useLinearKeyNav({
    containerRef: accordionRef,
    itemSelector: '[data-accordion="button"]',
    orientation: 'both',
  });

  return (
    <AccordionContext.Provider value={{ openAccordion, headingLevel, handleClick }}>
      <div className='accordion' ref={accordionRef} onKeyDown={onKeyDown}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;
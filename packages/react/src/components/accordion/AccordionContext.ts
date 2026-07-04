import { createContext, useContext } from 'react';

interface AccordionContextValue {
  openAccordion: string | null;
  headingLevel: 2 | 3 | 4 | 5 | 6 | null;
  handleClick: (itemId: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used inside an Accordion');
  }
  return context;
}
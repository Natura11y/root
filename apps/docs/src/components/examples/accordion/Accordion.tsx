import { Accordion as ReactAccordion, AccordionItem } from '@natura11y/react';

interface AccordionProps {
  defaultOpen?: string | null;
  headingLevel?: 2 | 3 | 4 | 5 | 6 | null;
  idPrefix?: string;
}

const Accordion = ({
  defaultOpen = null,
  headingLevel = null,
  idPrefix = '',
}: AccordionProps) => (
  <ReactAccordion
    defaultOpen={defaultOpen ? `${idPrefix}${defaultOpen}` : null}
    headingLevel={headingLevel}
  >
    <AccordionItem itemId={`${idPrefix}danaus-plexippus`} title='Danaus Plexippus'>
      <p>
        The monarch butterfly is one of the most familiar butterflies in North America.
        Its orange and black pattern makes it instantly recognizable.
      </p>
    </AccordionItem>

    <AccordionItem itemId={`${idPrefix}papilio-glaucus`} title='Papilio Glaucus'>
      <p>
        The eastern tiger swallowtail is a large butterfly known for yellow wings,
        black tiger-like stripes, and graceful flight.
      </p>
    </AccordionItem>

    <AccordionItem itemId={`${idPrefix}vanessa-cardui`} title='Vanessa Cardui'>
      <p>
        The painted lady is widely distributed and highly migratory, appearing across
        many regions and habitats throughout the year.
      </p>
    </AccordionItem>
  </ReactAccordion>
);

export default Accordion;

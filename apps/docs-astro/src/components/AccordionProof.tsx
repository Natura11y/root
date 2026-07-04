import { Accordion, AccordionItem } from '@natura11y/react';

const AccordionProof = () => (
  <Accordion defaultOpen='one' headingLevel={3}>
    <AccordionItem itemId='one' title='Same import shape'>
      <p>
        The component wrapper imports from <code>@natura11y/react</code>, even though this
        spike points that package name at the local working source.
      </p>
    </AccordionItem>

    <AccordionItem itemId='two' title='Useful docs migration proof'>
      <p>
        Compound React components can stay fully inside React, then Astro can hydrate
        the wrapper when interaction is needed.
      </p>
    </AccordionItem>
  </Accordion>
);

export default AccordionProof;

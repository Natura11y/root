import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaAccordion from '@core-js/accordion';
import Accordion from '@lib/components/accordion';
import accordionMarkup from './accordion.example.html?raw';

const items = [
  {
    itemId: 'danaus-plexippus',
    title: 'Danaus Plexippus',
    content: (
      <p>
        The monarch butterfly or simply monarch is a milkweed butterfly in the
        family Nymphalidae. Other common names, depending on region, include
        milkweed, common tiger, wanderer, and black veined brown. It may be
        the most familiar <a href='#1'>North American</a> butterfly, and is
        considered an iconic pollinator species.
      </p>
    ),
  },
  {
    itemId: 'papilio-polyxenes',
    title: 'Papilio Polyxenes',
    content: (
      <p>
        The black swallowtail, American swallowtail, or parsnip swallowtail,
        is a butterfly found throughout much of <a href='#1'>North America</a>.
        It is the state butterfly of Oklahoma and New Jersey.
      </p>
    ),
  },
  {
    itemId: 'hyalophora-cecropia',
    title: 'Hyalophora Cecropia',
    content: (
      <p>
        The cecropia moth is <a href='#1'>North America&apos;s</a> largest native
        moth. It is a member of the family Saturniidae, or giant silk moths.
        Females have been documented with a wingspan of five to seven inches
        or more.
      </p>
    ),
  },
  {
    itemId: 'deilephila-elpenor',
    title: 'Deilephila Elpenor',
    content: (
      <p>
        The elephant hawk moth or large elephant hawk moth, is a moth in the
        family Sphingidae. Its common name is derived from the caterpillar&apos;s
        resemblance to an elephant&apos;s trunk. It is most common in{' '}
        <a href='#1'>central Europe</a> and is distributed throughout the
        Palearctic region.
      </p>
    ),
  },
  {
    itemId: 'papilio-troilus',
    title: 'Papilio Troilus',
    content: (
      <p>
        The spicebush swallowtail or green-clouded butterfly, is a common
        black swallowtail butterfly found in <a href='#1'>North America</a>.
        It has two subspecies, Papilio troilus troilus and Papilio troilus
        ilioneus, the latter found mainly in the Florida peninsula.
      </p>
    ),
  },
];

const renderItems = () => (
  <>
    {items.map(({ itemId, title, content }) => (
      <Accordion.Item key={itemId} itemId={itemId} title={title}>
        {content}
      </Accordion.Item>
    ))}
  </>
);

const itemIds = items.map(({ itemId }) => itemId);

const accordionReactCode = `<Accordion>
  <Accordion.Item itemId="danaus-plexippus" title="Danaus Plexippus">
    <p>
      The monarch butterfly or simply monarch is a milkweed butterfly in the
      family Nymphalidae. Other common names, depending on region, include
      milkweed, common tiger, wanderer, and black veined brown. It may be
      the most familiar <a href="#1">North American</a> butterfly, and is
      considered an iconic pollinator species.
    </p>
  </Accordion.Item>

  <Accordion.Item itemId="papilio-polyxenes" title="Papilio Polyxenes">
    <p>
      The black swallowtail, American swallowtail, or parsnip swallowtail,
      is a butterfly found throughout much of <a href="#1">North America</a>.
      It is the state butterfly of Oklahoma and New Jersey.
    </p>
  </Accordion.Item>

  <Accordion.Item itemId="hyalophora-cecropia" title="Hyalophora Cecropia">
    <p>
      The cecropia moth is <a href="#1">North America's</a> largest native
      moth. It is a member of the family Saturniidae, or giant silk moths.
      Females have been documented with a wingspan of five to seven inches
      or more.
    </p>
  </Accordion.Item>

  <Accordion.Item itemId="deilephila-elpenor" title="Deilephila Elpenor">
    <p>
      The elephant hawk moth or large elephant hawk moth, is a moth in the
      family Sphingidae. Its common name is derived from the caterpillar's
      resemblance to an elephant's trunk. It is most common in
      <a href="#1">central Europe</a> and is distributed throughout the
      Palearctic region.
    </p>
  </Accordion.Item>

  <Accordion.Item itemId="papilio-troilus" title="Papilio Troilus">
    <p>
      The spicebush swallowtail or green-clouded butterfly, is a common
      black swallowtail butterfly found in <a href="#1">North America</a>.
      It has two subspecies, Papilio troilus troilus and Papilio troilus
      ilioneus, the latter found mainly in the Florida peninsula.
    </p>
  </Accordion.Item>
</Accordion>`;

const accordionOpenByDefaultCode = `<Accordion defaultOpen="danaus-plexippus">
  <Accordion.Item itemId="danaus-plexippus" title="Danaus Plexippus">
    <p>...</p>
  </Accordion.Item>

  <Accordion.Item itemId="papilio-polyxenes" title="Papilio Polyxenes">
    <p>...</p>
  </Accordion.Item>
</Accordion>`;

const accordionWithHeadingsCode = `<Accordion headingLevel={3}>
  <Accordion.Item itemId="danaus-plexippus" title="Danaus Plexippus">
    <p>...</p>
  </Accordion.Item>
</Accordion>`;

const VanillaAccordionExample = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = accordionMarkup;
    new VanillaAccordion().init();

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} />;
};

const meta = {
  title: 'Accordion',
  component: Accordion,
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component:
          'Use accordions to group related sections of content that expand and collapse with button controls.',
      },
    },
  },
  args: {
    children: renderItems(),
  },
  argTypes: {
    defaultOpen: {
      name: 'Initial open item',
      description:
        'Opens one accordion item on first render. Use the matching `itemId` from an `Accordion.Item`.',
      control: 'select',
      options: [null, ...itemIds],
      table: {
        category: 'Behavior',
        type: { summary: 'itemId or none' },
        defaultValue: { summary: 'none' },
      },
    },
    headingLevel: {
      name: 'Heading level',
      description:
        'Wraps each accordion button in a semantic heading. Choose the level that fits the page outline.',
      control: 'select',
      options: [null, 2, 3, 4, 5, 6],
      table: {
        category: 'Structure',
        type: { summary: '2, 3, 4, 5, 6, or none' },
        defaultValue: { summary: 'none' },
      },
    },
    open: {
      name: 'Open item',
      description:
        'Controlled open item ID. Pair with `onOpenChange` when the parent owns accordion state.',
      control: false,
      table: {
        category: 'Controlled API',
        type: { summary: 'itemId or none' },
      },
    },
    onOpenChange: {
      description: 'Called with the next open item ID, or `null` when all items are closed.',
      control: false,
      table: {
        category: 'Controlled API',
        type: { summary: '(itemId or none) => void' },
      },
    },
    children: {
      description: 'Accordion item content. Use `Accordion.Item` for each button and panel pair.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'Accordion.Item elements' },
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      description: {
        story: 'The vanilla HTML pattern uses Natura11y core markup and JavaScript behavior.',
      },
      source: {
        code: accordionMarkup,
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaAccordionExample />,
};

export const React: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The React component renders the same accordion item set with a React-friendly API.',
      },
      source: {
        code: accordionReactCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const OpenByDefault: Story = {
  args: {
    defaultOpen: 'danaus-plexippus',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `defaultOpen` when one accordion item should be expanded on first render.',
      },
      source: {
        code: accordionOpenByDefaultCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

export const WithHeadings: Story = {
  args: {
    headingLevel: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `headingLevel` when accordion buttons should participate in the page heading outline.',
      },
      source: {
        code: accordionWithHeadingsCode,
        language: 'tsx',
        type: 'code',
      },
    },
  },
};

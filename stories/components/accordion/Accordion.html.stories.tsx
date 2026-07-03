import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaAccordion from '@core-js/accordion';

const accordionMarkup = `
  <div class="accordion">
    <button
      class="accordion__button"
      id="html-acc-button-01"
      data-accordion="button"
      aria-controls="html-acc-panel-01"
      aria-expanded="true">
      Danaus Plexippus
    </button>

    <div
      class="accordion__panel shown"
      id="html-acc-panel-01"
      data-accordion="panel"
      aria-labelledby="html-acc-button-01"
      role="region">
      <div class="accordion__panel__content">
        <p>The monarch butterfly is a milkweed butterfly and one of the most familiar North American pollinators.</p>
      </div>
    </div>

    <button
      class="accordion__button"
      id="html-acc-button-02"
      data-accordion="button"
      aria-controls="html-acc-panel-02"
      aria-expanded="false">
      Papilio Polyxenes
    </button>

    <div
      class="accordion__panel"
      id="html-acc-panel-02"
      data-accordion="panel"
      aria-labelledby="html-acc-button-02"
      role="region">
      <div class="accordion__panel__content">
        <p>The black swallowtail is a butterfly found throughout much of North America.</p>
      </div>
    </div>
  </div>
`;

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
  title: 'Core/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Rendered as Natura11y HTML and initialized with the vanilla Accordion class from the core package source.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: accordionMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaAccordionExample />,
};
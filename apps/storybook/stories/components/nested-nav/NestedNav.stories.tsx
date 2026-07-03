import type { Meta, StoryObj } from '@storybook/react-vite';
import NestedNav from '@lib/components/natura11y/nested-nav';
import VanillaExample from '../../utils/VanillaExample';
import nestedNavMarkup from './nested-nav.example.html?raw';

const meta: Meta<typeof NestedNav> = {
  title: 'Nested Nav',
  component: NestedNav,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NestedNav>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: nestedNavMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={nestedNavMarkup} />,
};

export const React: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', current: true },
      {
        label: 'Components',
        href: '#',
        children: [
          { label: 'Accordion', href: '#' },
          { label: 'Button', href: '#' },
          {
            label: 'Form',
            href: '#',
            children: [
              { label: 'Input', href: '#' },
              { label: 'Select', href: '#' },
            ],
          },
        ],
      },
      { label: 'About', href: '#' },
    ],
  },
};

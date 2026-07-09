import type { Meta, StoryObj } from '@storybook/react-vite';
import NestedNav from '@lib/components/nested-nav';
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

const items = [
  { label: 'Overview', href: '#1' },
  {
    label: 'American Robin',
    href: '#1',
    current: 'true',
    children: [
      { label: 'Nesting', href: '#1', current: 'page' },
      { label: 'Diet', href: '#1' },
      { label: 'Migration', href: '#1' },
    ],
  },
  {
    label: 'Eastern Bluebird',
    href: '#1',
    children: [
      {
        label: 'Identification',
        href: '#1',
        children: [
          { label: 'Plumage', href: '#1' },
          { label: 'Song', href: '#1' },
        ],
      },
      { label: 'Habitat', href: '#1' },
    ],
  },
  { label: 'Conservation', href: '#1' },
  { label: 'Resources', href: '#1' },
];

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
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

export const DefaultReact: Story = {
  name: 'Default (React)',
  args: {
    ariaLabel: 'Field Guide Navigation',
    items: items,
  },
};

import type { ComponentProps } from 'react';
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
type NestedNavItems = NonNullable<ComponentProps<typeof NestedNav>['items']>;

const items: NestedNavItems = [
  { id: 'overview', label: 'Overview', href: '#1' },
  {
    id: 'american-robin',
    label: 'American Robin',
    href: '#1',
    current: 'true',
    children: [
      { id: 'american-robin-nesting', label: 'Nesting', href: '#1', current: 'page' },
      { id: 'american-robin-diet', label: 'Diet', href: '#1' },
      { id: 'american-robin-migration', label: 'Migration', href: '#1' },
    ],
  },
  {
    id: 'eastern-bluebird',
    label: 'Eastern Bluebird',
    href: '#1',
    children: [
      {
        id: 'eastern-bluebird-identification',
        label: 'Identification',
        href: '#1',
        children: [
          { id: 'eastern-bluebird-plumage', label: 'Plumage', href: '#1' },
          { id: 'eastern-bluebird-song', label: 'Song', href: '#1' },
        ],
      },
      { id: 'eastern-bluebird-habitat', label: 'Habitat', href: '#1' },
    ],
  },
  { id: 'conservation', label: 'Conservation', href: '#1' },
  { id: 'resources', label: 'Resources', href: '#1' },
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

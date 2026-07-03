import type { Meta, StoryObj } from '@storybook/react-vite';
import NestedNav from '@lib/components/natura11y/nested-nav';

const meta: Meta<typeof NestedNav> = {
  title: 'React/Components/Nested Nav',
  component: NestedNav,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NestedNav>;

export const Default: Story = {
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

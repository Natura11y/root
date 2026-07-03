import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from '@lib/components/natura11y/breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const React: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Breadcrumb' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Breadcrumb' },
    ],
  },
};

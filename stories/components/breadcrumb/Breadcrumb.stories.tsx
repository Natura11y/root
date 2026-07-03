import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from '@lib/components/natura11y/breadcrumb';
import VanillaExample from '../../utils/VanillaExample';
import breadcrumbMarkup from './breadcrumb.example.html?raw';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: breadcrumbMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={breadcrumbMarkup} />,
};

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

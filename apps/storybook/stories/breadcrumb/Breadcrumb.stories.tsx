import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from '@lib/components/breadcrumb';
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

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
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
      { id: 'home', label: 'Home', href: '#1' },
      { id: 'recipes', label: 'Recipes', href: '#1' },
      { id: 'baking', label: 'Baking', href: '#1' },
      { id: 'focaccia', label: 'Focaccia' },
    ],
  },
};

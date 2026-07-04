import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './navigation.example.html?raw';

const meta = {
  title: 'Navigation',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Navigation provides the shared list structure used by menus, actions, dividers, and icon links.',
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
        code: markup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={markup} />,
};

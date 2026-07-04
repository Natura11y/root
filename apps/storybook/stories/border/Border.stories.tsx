import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './border.example.html?raw';

const meta = {
  title: 'Border',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Border utilities handle sides, color, and radius using Natura11y theme variables.',
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

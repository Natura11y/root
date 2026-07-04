import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './breakpoint.example.html?raw';

const meta = {
  title: 'Breakpoint',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Breakpoint modifiers apply many Natura11y utilities at responsive viewport sizes.',
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

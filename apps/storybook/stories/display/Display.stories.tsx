import type { Meta, StoryObj } from '@storybook/react-vite';
import markup from './display.example.html?raw';

const meta = {
  title: 'Display',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Display utilities switch the CSS display value directly, including responsive modifiers.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: markup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <></>,
};

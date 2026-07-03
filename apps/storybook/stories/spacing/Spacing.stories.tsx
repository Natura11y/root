import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../utils/VanillaExample';
import spacingMarkup from './spacing.example.html?raw';

const meta = {
  title: 'Spacing',
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: spacingMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={spacingMarkup} />,
};

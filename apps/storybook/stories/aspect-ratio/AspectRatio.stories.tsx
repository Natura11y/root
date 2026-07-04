import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './aspect-ratio.example.html?raw';

const meta = {
  title: 'Aspect Ratio',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Aspect ratio utilities lock media, cards, and visual regions to predictable proportions.',
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

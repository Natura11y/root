import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './opacity.example.html?raw';

const meta = {
  title: 'Opacity',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Opacity utilities apply filter-based opacity in ten-percent steps.',
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

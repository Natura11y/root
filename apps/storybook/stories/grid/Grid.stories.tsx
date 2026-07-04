import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './grid.example.html?raw';

const meta = {
  title: 'Grid',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Grid utilities create responsive columns, spanning, dividers, and sidebar layouts.',
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

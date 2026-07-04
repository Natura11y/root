import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './sizing.example.html?raw';

const meta = {
  title: 'Sizing',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Sizing utilities apply common width, height, and minimum-height values.',
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

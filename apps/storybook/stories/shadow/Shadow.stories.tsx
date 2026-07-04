import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './shadow.example.html?raw';

const meta = {
  title: 'Shadow',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Shadow utilities provide box shadows, drop shadows, and text shadows.',
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

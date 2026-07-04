import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './overflow.example.html?raw';

const meta = {
  title: 'Overflow',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Overflow utilities control clipping and scroll behavior for constrained regions.',
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

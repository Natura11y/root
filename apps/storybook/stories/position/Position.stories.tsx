import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './position.example.html?raw';

const meta = {
  title: 'Position',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Position utilities provide relative containers, absolute placement, and sticky top behavior.',
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
  render: () => <VanillaExample html={markup} />,
};

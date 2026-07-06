import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './flex.example.html?raw';

const meta = {
  title: 'Flex',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Flex utilities provide direction, alignment, growth, and responsive layout helpers.',
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

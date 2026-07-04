import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './z-index.example.html?raw';

const meta = {
  title: 'Z-index',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Z-index utilities provide predictable stacking values for positioned interface layers.',
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

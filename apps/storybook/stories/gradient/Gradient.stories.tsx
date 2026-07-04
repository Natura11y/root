import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './gradient.example.html?raw';

const meta = {
  title: 'Gradient',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Gradient mask utilities fade visual content by direction or vignette.',
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './container.example.html?raw';

const meta = {
  title: 'Container',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Container and width utilities keep page content aligned and readable.',
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

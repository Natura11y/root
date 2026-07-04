import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './link.example.html?raw';

const meta = {
  title: 'Link',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Link utilities make non-paragraph links, icon links, and expanded link targets consistent.',
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

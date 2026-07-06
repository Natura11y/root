import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import markup from './border.example.html?raw';
import borderColorMarkup from './border-color.example.html?raw';
import borderRadiusMarkup from './border-radius.example.html?raw';

const meta = {
  title: 'Border',
  parameters: {
    docs: {
      description: {
        component: 'Border utilities handle sides, color, and radius using Natura11y theme variables.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <VanillaExample html={markup} />,
};

export const Color: Story = {
  render: () => <VanillaExample html={borderColorMarkup} />,
};

export const Radius: Story = {
  render: () => <VanillaExample html={borderRadiusMarkup} />,
};

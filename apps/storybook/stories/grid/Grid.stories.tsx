import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaExample from '../../utils/VanillaExample';
import defaultMarkup from './grid.example.html?raw';
import columnSpanMarkup from './grid-column-span.example.html?raw';
import rowSpanMarkup from './grid-row-span.example.html?raw';
import dividersMarkup from './grid-dividers.example.html?raw';
import orderMarkup from './grid-order.example.html?raw';
import sidebarMarkup from './grid-sidebar.example.html?raw';

const meta = {
  title: 'Grid',
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component: 'Grid utilities create responsive columns, spanning, dividers, and sidebar layouts.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sourceParameters = (markup: string) => ({
  docs: {
    source: {
      code: markup.trim(),
      language: 'html',
      type: 'code',
    },
  },
});

export const Default: Story = {
  parameters: sourceParameters(defaultMarkup),
  render: () => <VanillaExample html={defaultMarkup} />,
};

export const ColumnSpan: Story = {
  parameters: sourceParameters(columnSpanMarkup),
  render: () => <VanillaExample html={columnSpanMarkup} />,
};

export const RowSpan: Story = {
  parameters: sourceParameters(rowSpanMarkup),
  render: () => <VanillaExample html={rowSpanMarkup} />,
};

export const Dividers: Story = {
  parameters: sourceParameters(dividersMarkup),
  render: () => <VanillaExample html={dividersMarkup} />,
};

export const Order: Story = {
  parameters: sourceParameters(orderMarkup),
  render: () => <VanillaExample html={orderMarkup} />,
};

export const SidebarLayouts: Story = {
  parameters: sourceParameters(sidebarMarkup),
  render: () => <VanillaExample html={sidebarMarkup} />,
};

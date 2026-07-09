import type { Meta, StoryObj } from '@storybook/react-vite';
import Pagination from '@lib/components/pagination';
import VanillaExample from '../../utils/VanillaExample';
import paginationMarkup from './pagination.example.html?raw';
import visibleLabelsMarkup from './pagination-visible-labels.example.html?raw';

const meta: Meta<typeof Pagination> = {
  title: 'Pagination',
  component: Pagination,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const truncatedItems = [
  { id: 'previous-page', iconHandle: 'arrow-left', ariaLabel: 'Previous page', href: '#prev' },
  { id: 'page-1', label: '1', href: '#1' },
  { id: 'page-2', label: '2', href: '#2' },
  { id: 'page-3', label: '3', href: '#3', current: true },
  { id: 'page-4', label: '4', href: '#4' },
  { id: 'more-pages', ellipsis: true },
  { id: 'page-9', label: '9', href: '#9' },
  { id: 'next-page', iconHandle: 'arrow-right', ariaLabel: 'Next page', href: '#next' },
];

const visibleLabelItems = [
  { id: 'previous-page', iconHandle: 'arrow-left', label: 'Previous', href: '#prev' },
  { id: 'page-1', label: '1', href: '#1' },
  { id: 'page-2', label: '2', href: '#2' },
  { id: 'page-3', label: '3', href: '#3', current: true },
  { id: 'page-4', label: '4', href: '#4' },
  { id: 'more-pages', ellipsis: true },
  { id: 'page-9', label: '9', href: '#9' },
  { id: 'next-page', iconHandle: 'arrow-right', iconPosition: 'end' as const, label: 'Next', href: '#next' },
];

const createHtmlStory = (markup: string): Story => ({
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
});

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  ...createHtmlStory(paginationMarkup),
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  args: {
    items: truncatedItems,
  },
};

export const VisibleLabelsHtml: Story = {
  name: 'Visible Labels (HTML)',
  ...createHtmlStory(visibleLabelsMarkup),
};

export const VisibleLabelsReact: Story = {
  name: 'Visible Labels (React)',
  args: {
    items: visibleLabelItems,
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import Pagination from '@lib/components/natura11y/pagination';

const meta: Meta<typeof Pagination> = {
  title: 'React/Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    items: [
      { iconHandle: 'arrow-left', ariaLabel: 'Previous page', href: '#' },
      { label: '1', href: '#', ariaLabel: 'Page 1' },
      { label: '2', href: '#', ariaLabel: 'Page 2', current: true },
      { label: '3', href: '#', ariaLabel: 'Page 3' },
      { iconHandle: 'arrow-right', ariaLabel: 'Next page', href: '#' },
    ],
  },
};

export const WithEllipsis: Story = {
  args: {
    items: [
      { iconHandle: 'arrow-left', ariaLabel: 'Previous page', href: '#' },
      { label: '1', href: '#', ariaLabel: 'Page 1' },
      { label: '2', href: '#', ariaLabel: 'Page 2' },
      { ellipsis: true },
      { label: '8', href: '#', ariaLabel: 'Page 8' },
      { label: '9', href: '#', ariaLabel: 'Page 9', current: true },
      { label: '10', href: '#', ariaLabel: 'Page 10' },
      { iconHandle: 'arrow-right', ariaLabel: 'Next page', href: '#' },
    ],
  },
};

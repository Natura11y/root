import type { Meta, StoryObj } from '@storybook/react-vite';
import Table from './index';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const headers = ['Name', 'Role', 'Status'];
const rows = [
  { name: 'Alice', role: 'Designer', status: 'Active' },
  { name: 'Bob', role: 'Developer', status: 'Active' },
  { name: 'Carol', role: 'Manager', status: 'Away' },
];

export const Default: Story = {
  args: { headers, rows },
};

export const WithCaption: Story = {
  args: {
    caption: 'Team Members',
    headers,
    rows,
  },
};

export const Striped: Story = {
  args: {
    headers,
    rows,
    utilities: 'table--striped',
  },
};

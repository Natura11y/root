import type { Meta, StoryObj } from '@storybook/react-vite';
import Table from './index';
import TableScroll from './TableScroll';
import { tableData } from './tableData';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    stack: {
      control: 'select',
      options: [null, 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const headers = ['Name', 'Country', 'Map View'];
const rows = [
  { name: "Giant's Causeway", country: 'Northern Ireland', map: <a href='#1'>Map View</a> },
  { name: "Fingal's Cave", country: 'Scotland', map: <a href='#1'>Map View</a> },
  { name: 'Garni Gorge', country: 'Armenia', map: <a href='#1'>Map View</a> },
  { name: 'Cape Raoul', country: 'Tasmania', map: <a href='#1'>Map View</a> },
  { name: 'Svartifoss', country: 'Iceland', map: <a href='#1'>Map View</a> },
];

export const Default: Story = {
  args: {
    caption: 'Places with columnar jointed volcanics',
    headers,
    rows,
  },
};

export const EdgeToEdge: Story = {
  args: {
    caption: 'Places with columnar jointed volcanics',
    headers,
    rows,
    utilities: 'table--edge',
  },
};

export const StripedRows: Story = {
  args: {
    caption: 'Places with columnar jointed volcanics',
    headers,
    rows,
    utilities: 'table--striped',
  },
};

export const TableDivider: Story = {
  args: {
    caption: 'Places with columnar jointed volcanics',
    headers,
    rows,
    utilities: 'table--divider box-shadow-1',
  },
};

export const ScrollingTables: Story = {
  render: (args) => (
    <TableScroll>
      <Table {...args} />
    </TableScroll>
  ),
  args: tableData,
};

export const StackingColumns: Story = {
  args: {
    ...tableData,
    stack: 'lg',
  },
};

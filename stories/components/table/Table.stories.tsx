import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaTable from '@core-js/table';
import Table from '@lib/components/natura11y/table';
import TableScroll from '@lib/components/natura11y/table/TableScroll';
import { tableData } from '@lib/components/natura11y/table/tableData';
import VanillaExample from '../../utils/VanillaExample';
import tableMarkup from './table.example.html?raw';

const initializeTable = () => {
  new VanillaTable().init();
};

const meta: Meta<typeof Table> = {
  title: 'Table',
  component: Table,
  argTypes: {
    stack: {
      control: 'select',
      options: [null, 'sm', 'md', 'lg', 'xl', 'xxl'],
    },
  },
  parameters: {
    docs: {
      codePanel: true,
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

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: tableMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={tableMarkup} initialize={initializeTable} />
  ),
};

export const React: Story = {
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

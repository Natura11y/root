import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaTable from '@core-js/table';
import Table from '@lib/components/table';
import TableScroll from '@lib/components/table/TableScroll';
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

const responsiveHeaders = ['Name', 'Country', 'Coordinates', 'Map View'];
const responsiveRows = [
  { name: "Giant's Causeway", country: 'Northern Ireland', coordinates: "55°14'27″N 6°30'42″W", map: <a href='#1'>Map View</a> },
  { name: "Fingal's Cave", country: 'Scotland', coordinates: "56°26'02″N 6°20'10″W", map: <a href='#1'>Map View</a> },
  { name: 'Garni Gorge', country: 'Armenia', coordinates: "40°11'N 44°31'E", map: <a href='#1'>Map View</a> },
  { name: 'Cape Raoul', country: 'Tasmania', coordinates: "43°12'04″S 147°45'48″E", map: <a href='#1'>Map View</a> },
  { name: 'Svartifoss', country: 'Iceland', coordinates: '64.023°N 16.975°W', map: <a href='#1'>Map View</a> },
];

const responsiveTableArgs = {
  caption: 'Places with columnar jointed volcanics',
  headers: responsiveHeaders,
  rows: responsiveRows,
};

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
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

export const DefaultReact: Story = {
  name: 'Default (React)',
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
  args: responsiveTableArgs,
};

export const StackingColumns: Story = {
  args: {
    ...responsiveTableArgs,
    stack: 'lg',
  },
};

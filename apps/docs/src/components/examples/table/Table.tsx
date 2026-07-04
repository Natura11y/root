import type { ReactNode } from 'react';
import { Table as ReactTable, TableScroll } from '@natura11y/react';

type TableVariant =
  | 'basic'
  | 'edge'
  | 'striped'
  | 'divider'
  | 'scroll'
  | 'stack';

interface TableDocsProps {
  variant?: TableVariant;
}

const mapLink = (
  <span className="display-block text-align-right">
    <a href="#1">Map View</a>
  </span>
);

const basicHeaders = ['Name', 'Country', 'Map View'];
const basicRows: Record<string, ReactNode>[] = [
  { name: "Giant's Causeway", country: 'Northern Ireland', map: mapLink },
  { name: "Fingal's Cave", country: 'Scotland', map: mapLink },
  { name: 'Garni Gorge', country: 'Armenia', map: mapLink },
  { name: 'Cape Raoul', country: 'Tasmania', map: mapLink },
  { name: 'Svartifoss', country: 'Iceland', map: mapLink },
];

const responsiveHeaders = ['Name', 'Country', 'Coordinates', 'Map View'];
const responsiveRows: Record<string, ReactNode>[] = [
  {
    name: "Giant's Causeway",
    country: 'Northern Ireland',
    coordinates: "55°14'27″N 6°30'42″W",
    map: mapLink,
  },
  {
    name: "Fingal's Cave",
    country: 'Scotland',
    coordinates: "56°26'02″N 6°20'10″W",
    map: mapLink,
  },
  {
    name: 'Garni Gorge',
    country: 'Armenia',
    coordinates: "40°11'N 44°31'E",
    map: mapLink,
  },
  {
    name: 'Cape Raoul',
    country: 'Tasmania',
    coordinates: "43°12'04″S 147°45'48″E",
    map: mapLink,
  },
  {
    name: 'Svartifoss',
    country: 'Iceland',
    coordinates: '64.023°N 16.975°W',
    map: mapLink,
  },
];

const getUtilities = (variant: TableVariant) => {
  if (variant === 'edge') return 'table--edge';
  if (variant === 'striped') return 'table--striped';
  if (variant === 'divider') return 'table--divider box-shadow-1';
  return null;
};

const Table = ({ variant = 'basic' }: TableDocsProps) => {
  if (variant === 'scroll') {
    return (
      <TableScroll>
        <ReactTable
          caption="Places with columnar jointed volcanics"
          headers={responsiveHeaders}
          rows={responsiveRows}
        />
      </TableScroll>
    );
  }

  if (variant === 'stack') {
    return (
      <ReactTable
        caption="Places with columnar jointed volcanics"
        headers={responsiveHeaders}
        rows={responsiveRows}
        stack="lg"
      />
    );
  }

  return (
    <ReactTable
      caption="Places with columnar jointed volcanics"
      headers={basicHeaders}
      rows={basicRows}
      utilities={getUtilities(variant)}
    />
  );
};

export default Table;

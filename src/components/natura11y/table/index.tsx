import { type Ref, type ReactNode } from 'react';
import classNames from 'classnames';

interface TableProps {
  ref?: Ref<HTMLTableElement>;
  caption?: string | null;
  headers?: string[];
  rows?: Record<string, ReactNode>[];
  utilities?: string | null;
}

const Table = ({
  ref,
  caption = null,
  headers = [],
  rows = [],
  utilities = null,
}: TableProps) => (
  <table ref={ref} className={classNames('table', utilities)}>
    {caption && <caption>{caption}</caption>}
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} scope='col'>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rowIndex) => {
        const cells = Object.values(row);
        return (
          <tr key={rowIndex}>
            {cells.map((cell, cellIndex) => (
              <td key={cellIndex} data-header={headers[cellIndex]}>{cell}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default Table;
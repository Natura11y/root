import { useId, type Ref, type ReactNode } from 'react';
import classNames from 'classnames';

interface TableProps {
  ref?: Ref<HTMLTableElement>;
  caption?: string | null;
  headers?: string[];
  rows?: Record<string, ReactNode>[];
  stack?: string | null;
  utilities?: string | null;
}

const Table = ({
  ref,
  caption = null,
  headers = [],
  rows = [],
  stack = null,
  utilities = null,
}: TableProps) => {
  const tableId = useId().replace(/:/g, '');
  const isStacked = stack !== null || utilities?.includes('table--stack');
  const headerId = (index: number) => `${tableId}-header-${index}`;

  const tableClasses = classNames(
    'table',
    {
      [`table--stack--${stack}`]: stack !== null,
    },
    utilities
  );

  return (
    <table ref={ref} className={tableClasses}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} id={isStacked ? headerId(index) : undefined} scope='col'>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => {
          const cells = Object.values(row);
          return (
            <tr key={rowIndex}>
              {cells.map((cell, cellIndex) => {
                const header = headers[cellIndex];
                return (
                  <td
                    key={cellIndex}
                    aria-labelledby={isStacked && header ? headerId(cellIndex) : undefined}
                    data-header={header}
                  >
                    {isStacked ? (
                      <div className='td-content'>
                        {cell}
                      </div>
                    ) : cell}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;

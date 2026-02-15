import { forwardRef } from 'react';

import classNames from 'classnames';

import { tableData } from './tableData';

const Table = forwardRef(( props, ref ) => {

  const {
    utilities = null
  } = props;

  const {
      headers, 
      rows 
  } = tableData;

  const tableHeaders = headers.map((header, index) => (
    <th key={index} scope='col'>
      {header}
    </th>
  ));

  const tableRows = rows.map((row, index) => {
   
    // convert object to array
    const rowData = Object.values(row);

    const tableCells = rowData.map((cell, index) => (
      <td key={index} data-header={headers[index]}>
        {cell}
      </td>
    ));

    return (
      <tr key={index}>
        {tableCells}
        <td data-header='Map' className='text-align-right'>
          <a href={`#${index}`}>Map View</a>
        </td>
      </tr>
    );
  });

	const tableClasses = classNames(
		'table',
		{
			[`${utilities}`] : utilities !== null
		}
	);

  return (
    <table ref={ref} className={tableClasses}>

      <caption>
        {tableData.caption}
      </caption>

      <thead>
        <tr>
          {tableHeaders}
        </tr>
      </thead>

      <tbody>
        {tableRows}
      </tbody>

    </table>
  );
});

export default Table;
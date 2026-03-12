import classNames from 'classnames';

const Table = ({
    ref,
    caption = null,
    headers = [],
    rows = [],
    utilities = null
}) => {
    const tableClasses = classNames('table', utilities);

    return (
        <table ref={ref} className={tableClasses}>
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
};

export default Table;

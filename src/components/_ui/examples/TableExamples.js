import Table from '../../natura11y/table';
import TableScroll from '../../natura11y/table/TableScroll';
import { tableData } from '../../natura11y/table/tableData';

const { caption, headers, rows } = tableData;

const TableExamples = () => (
    <div className='wide margin-x-auto'>
        <TableScroll>
            <Table caption={caption} headers={headers} rows={rows} />
        </TableScroll>
        <Table caption={caption} headers={headers} rows={rows} utilities='table--stack--lg margin-y-5' />
    </div>
);

export default TableExamples;

import Table from '../../natura11y/table';
import TableScroll from '../../natura11y/table/TableScroll';

const TableExamples = () => {
	return (
		<div className='wide margin-x-auto'>
			<TableScroll />
			<Table utilities={'table--stack--lg margin-y-5'} />
		</div>
	);
};

export default TableExamples;

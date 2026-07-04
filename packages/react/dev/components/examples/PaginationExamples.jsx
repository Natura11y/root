import Pagination from '@lib/components/pagination';

const basicItems = [
    { ariaLabel: 'Previous page', href: '#1', iconHandle: 'arrow-left' },
    { label: '1', href: '#1' },
    { label: '2', href: '#2', current: true },
    { label: '3', href: '#3' },
    { ellipsis: true },
    { label: '10', href: '#10' },
    { ariaLabel: 'Next page', href: '#3', iconHandle: 'arrow-right' },
];

const labelledItems = [
    { label: 'Previous', href: '#1', iconHandle: 'arrow-left' },
    { label: '1', href: '#1' },
    { label: '2', href: '#2', current: true },
    { label: '3', href: '#3' },
    { ellipsis: true },
    { label: '10', href: '#10' },
    { label: 'Next', href: '#3', iconHandle: 'arrow-right' },
];

const PaginationExamples = () => (
    <div className='container narrow margin-x-auto grid gap-4'>
        <Pagination items={basicItems} />
        <Pagination items={labelledItems} />
    </div>
);

export default PaginationExamples;
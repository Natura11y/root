import Breadcrumb from '../../natura11y/breadcrumb';

const BreadcrumbExamples = () => (
    <div className='container narrow margin-x-auto grid gap-4'>

        <Breadcrumb
            items={[
                { label: 'Home', href: '#1' },
                { label: 'Recipes', href: '#2' },
                { label: 'Baking', href: '#3' },
                { label: 'Focaccia' },
            ]}
        />

        <Breadcrumb
            items={[
                { label: 'Home', href: '#1' },
                { label: 'Components', href: '#2' },
                { label: 'Breadcrumb' },
            ]}
        />

    </div>
);

export default BreadcrumbExamples;

import Breadcrumb from '@lib/components/breadcrumb';

const BreadcrumbExamples = () => (
    <div className='container narrow margin-x-auto grid gap-4'>

        <Breadcrumb
            items={[
                { label: 'Home', href: '#1' },
                { label: 'Recipes', href: '#1' },
                { label: 'Baking', href: '#1' },
                { label: 'Focaccia' },
            ]}
        />

    </div>
);

export default BreadcrumbExamples;

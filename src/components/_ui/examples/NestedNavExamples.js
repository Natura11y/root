import NestedNav from '../../natura11y/nested-nav';

const navItems = [
    {
        label: 'Get Started',
        href: '#1',
        current: true,
    },
    {
        label: 'Layout',
        href: '#2',
        children: [
            { label: 'Container', href: '#2a' },
            { label: 'Grid', href: '#2b' },
            { label: 'Flex', href: '#2c' },
        ],
    },
    {
        label: 'Components',
        href: '#3',
        children: [
            {
                label: 'Navigation',
                href: '#3a',
                children: [
                    { label: 'Main Menu', href: '#3a1' },
                    { label: 'Dropdown', href: '#3a2' },
                ],
            },
            { label: 'Modal', href: '#3b' },
        ],
    },
    {
        label: 'Utilities',
        href: '#4',
    },
];

const NestedNavExamples = () => (
    <div className='container narrow margin-x-auto'>
        <NestedNav items={navItems} ariaLabel='Docs navigation' />
    </div>
);

export default NestedNavExamples;

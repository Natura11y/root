import Badge from '../../natura11y/badge';

const BadgeExamples = () => (
    <div className='container narrow margin-x-auto grid gap-4'>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge>Default</Badge>
            <Badge theme='primary'>Primary</Badge>
            <Badge theme='secondary'>Secondary</Badge>
            <Badge theme='dark'>Dark</Badge>
        </div>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge iconHandle='bell'>Default</Badge>
            <Badge iconHandle='bell' theme='primary'>Primary</Badge>
            <Badge iconHandle='bell' theme='secondary'>Secondary</Badge>
            <Badge iconHandle='bell' theme='dark'>Dark</Badge>
        </div>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge tag='a' href='#1' iconHandle='bell'>Link Badge</Badge>
            <Badge tag='button' iconHandle='star' theme='primary'>Button Badge</Badge>
        </div>

    </div>
);

export default BadgeExamples;

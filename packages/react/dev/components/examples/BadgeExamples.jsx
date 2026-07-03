import Badge from '@lib/components/natura11y/badge';

const BadgeExamples = () => (
    <div className='container narrow margin-x-auto grid gap-4'>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge>Default</Badge>
            <Badge utilities='theme-primary'>Primary</Badge>
            <Badge utilities='theme-secondary'>Secondary</Badge>
            <Badge utilities='theme-dark'>Dark</Badge>
        </div>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge iconHandle='bell'>Default</Badge>
            <Badge iconHandle='bell' utilities='theme-primary'>Primary</Badge>
            <Badge iconHandle='bell' utilities='theme-secondary'>Secondary</Badge>
            <Badge iconHandle='bell' utilities='theme-dark'>Dark</Badge>
        </div>

        <div className='flex-row gap-2 flex-wrap'>
            <Badge tag='a' href='#1' iconHandle='bell'>Link Badge</Badge>
            <Badge tag='button' iconHandle='star' utilities='theme-primary'>Button Badge</Badge>
        </div>

    </div>
);

export default BadgeExamples;
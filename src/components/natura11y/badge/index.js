import classNames from 'classnames';

const Badge = ({
    tag = 'span',
    iconHandle = null,
    utilities = null,
    children
}) => {
    const Tag = tag;

    return (
        <Tag className={classNames('badge', utilities)}>
            {iconHandle && (
                <span className={`icon icon-${iconHandle}`} aria-hidden='true' />
            )}
            {children}
        </Tag>
    );
};

export default Badge;

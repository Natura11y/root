import classNames from 'classnames';

const Badge = ({
    tag = 'span',
    iconHandle = null,
    theme = null,
    utilities = null,
    children
}) => {
    const Tag = tag;

    const badgeClasses = classNames(
        'badge',
        { [`theme-${theme}`]: theme },
        utilities
    );

    return (
        <Tag className={badgeClasses}>
            {iconHandle && (
                <span className={`icon icon-${iconHandle}`} aria-hidden='true' />
            )}
            {children}
        </Tag>
    );
};

export default Badge;

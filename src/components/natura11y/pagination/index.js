import classNames from 'classnames';

const Pagination = ({
    items = [],
    ariaLabel = 'Pagination',
    linkTag = 'a',
    utilities = null
}) => {
    const paginationClasses = classNames('pagination', utilities);

    return (
        <nav aria-label={ariaLabel}>
            <ul className={paginationClasses}>
                {items.map((item, index) => {
                    if (item.ellipsis) {
                        return (
                            <li key={index} aria-hidden='true'>
                                <span className='icon icon-more-horizontal' aria-hidden='true' />
                            </li>
                        );
                    }

                    const LinkTag = item.linkTag || linkTag;

                    return (
                        <li key={index}>
                            <LinkTag
                                href={item.href}
                                {...(item.current && { 'aria-current': 'page' })}
                                {...(item.ariaLabel && { 'aria-label': item.ariaLabel })}
                                {...item.linkProps}
                            >
                                {item.iconHandle && (
                                    <span className={`icon icon-${item.iconHandle}`} aria-hidden='true' />
                                )}
                                {item.label && (
                                    <span className='text'>{item.label}</span>
                                )}
                            </LinkTag>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Pagination;

import classNames from 'classnames';

const Breadcrumb = ({
    items = [],
    ariaLabel = 'Breadcrumb',
    linkTag = 'a',
    utilities = null
}) => {
    return (
        <nav aria-label={ariaLabel} className={utilities || undefined}>
            <ul className={classNames('breadcrumb')}>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const LinkTag = item.linkTag || linkTag;

                    return (
                        <li key={index} {...(isLast && { 'aria-current': 'page' })}>
                            {isLast ? (
                                item.label
                            ) : (
                                <LinkTag href={item.href} {...item.linkProps}>
                                    {item.label}
                                </LinkTag>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;

import classNames from 'classnames';

const NavItems = ({ items, linkTag, depth = 0 }) => {
    return (
        <>
            {items.map((item, index) => {
                const LinkTag = item.linkTag || linkTag;
                const isCurrent = item.current || false;

                return (
                    <li key={index}>
                        <LinkTag
                            href={item.href}
                            {...(isCurrent && { 'aria-current': 'page' })}
                            {...item.linkProps}
                        >
                            {item.label}
                        </LinkTag>
                        {item.children?.length > 0 && (
                            <ul>
                                <NavItems
                                    items={item.children}
                                    linkTag={linkTag}
                                    depth={depth + 1}
                                />
                            </ul>
                        )}
                    </li>
                );
            })}
        </>
    );
};

const NestedNav = ({
    items = [],
    ariaLabel = null,
    linkTag = 'a',
    utilities = null
}) => {
    const navClasses = classNames('nested-nav', utilities);

    return (
        <ul
            className={navClasses}
            {...(ariaLabel && { 'aria-label': ariaLabel })}
        >
            <NavItems items={items} linkTag={linkTag} />
        </ul>
    );
};

export default NestedNav;

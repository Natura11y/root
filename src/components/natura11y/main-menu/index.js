import { useState, useRef, useEffect, useId } from 'react';

import classNames from 'classnames';

const MainMenu = ({
    variant = 'bar',
    breakpoint = 'lg',
    logo = null,
    search = null,
    actions = null,
    navAriaLabel = 'Main Menu',
    navId: navIdProp = null,
    searchId: searchIdProp = null,
    utilities = null,
    children
}) => {

    const uid = useId();
    const navId = navIdProp || `main-menu-${uid.replace(/:/g, '')}`;
    const searchId = searchIdProp || `search-${uid.replace(/:/g, '')}`;

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const searchFormRef = useRef(null);

    const handleMenuToggle = () => {
        if (!menuOpen && searchOpen) setSearchOpen(false);
        setMenuOpen(prev => !prev);
    };

    const handleSearchToggle = () => {
        if (!searchOpen && menuOpen) setMenuOpen(false);
        setSearchOpen(prev => !prev);
    };

    // Focus first focusable element in search form when it opens (bar variant only)
    useEffect(() => {
        if (searchOpen && searchFormRef.current) {
            const first = searchFormRef.current.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
            first?.focus();
        }
    }, [searchOpen]);

    const rootClasses = classNames(
        `main-menu--${variant}--${breakpoint}`,
        utilities
    );

    const logoArea = logo ? (
        <div className="main-menu__logo">
            {logo}
        </div>
    ) : null;

    const navArea = (
        <nav
            className={classNames('main-menu__nav', { shown: menuOpen })}
            id={navId}
            aria-label={navAriaLabel}
        >
            <ul>{children}</ul>
        </nav>
    );

    const toggleArea = (
        <div className="main-menu__toggle">
            {variant === 'bar' && search && (
                <button
                    className="button button--icon-only"
                    aria-label="Search"
                    aria-controls={searchId}
                    aria-expanded={searchOpen}
                    onClick={handleSearchToggle}
                >
                    <span className="icon icon-search" />
                </button>
            )}
            <button
                className="button button--icon-only"
                aria-label="Menu"
                aria-controls={navId}
                aria-expanded={menuOpen}
                onClick={handleMenuToggle}
            >
                <span className="icon icon-menu" />
            </button>
        </div>
    );

    const searchArea = search ? (
        <form
            ref={searchFormRef}
            className={classNames('main-menu__search', {
                shown: variant === 'bar' && searchOpen
            })}
            id={searchId}
            role="search"
        >
            {search}
        </form>
    ) : null;

    const actionsArea = actions ? (
        <div className="main-menu__actions">
            {actions}
        </div>
    ) : null;

    // Bar: logo → nav → toggle → search → actions
    // Stack: logo → toggle → search → actions → nav
    return (
        <div className={rootClasses}>
            {logoArea}
            {variant === 'bar' ? (
                <>
                    {navArea}
                    {toggleArea}
                    {searchArea}
                    {actionsArea}
                </>
            ) : (
                <>
                    {toggleArea}
                    {searchArea}
                    {actionsArea}
                    {navArea}
                </>
            )}
        </div>
    );
};

export default MainMenu;

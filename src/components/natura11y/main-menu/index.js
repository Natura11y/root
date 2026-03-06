import { useState, useRef, useEffect, useCallback, useId } from 'react';

import classNames from 'classnames';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const useCollapse = (panelRef) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        const el = panelRef.current;
        if (!el) return;

        if (prefersReducedMotion()) {
            el.classList.add('shown');
            setIsOpen(true);
            return;
        }

        el.setAttribute('data-active', '');
        requestAnimationFrame(() => {
            el.classList.add('shown');
            setIsOpen(true);
        });
    }, [panelRef]);

    const close = useCallback(() => {
        const el = panelRef.current;
        if (!el) return;

        if (prefersReducedMotion()) {
            el.classList.remove('shown');
            el.removeAttribute('data-active');
            setIsOpen(false);
            return;
        }

        el.classList.remove('shown');

        const onEnd = (e) => {
            if (e.propertyName !== 'grid-template-rows' && e.propertyName !== 'height') return;
            el.removeEventListener('transitionend', onEnd);
            el.removeAttribute('data-active');
        };
        el.addEventListener('transitionend', onEnd);

        setIsOpen(false);
    }, [panelRef]);

    const toggle = useCallback(() => {
        const el = panelRef.current;
        if (!el) return;
        el.classList.contains('shown') ? close() : open();
    }, [panelRef, open, close]);

    return { isOpen, open, close, toggle };
};

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

    const navRef = useRef(null);
    const searchFormRef = useRef(null);

    const nav = useCollapse(navRef);
    const searchPanel = useCollapse(searchFormRef);

    const handleMenuToggle = () => {
        if (!nav.isOpen && searchPanel.isOpen) searchPanel.close();
        nav.toggle();
    };

    const handleSearchToggle = () => {
        if (!searchPanel.isOpen && nav.isOpen) nav.close();
        searchPanel.toggle();
    };

    // Focus first focusable element after search panel finishes opening (bar variant only)
    useEffect(() => {
        if (!searchPanel.isOpen || !searchFormRef.current) return;

        const el = searchFormRef.current;

        const focusFirst = () => {
            const first = el.querySelector(
                'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            first?.focus();
        };

        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'grid-template-rows' && e.propertyName !== 'height') return;
            el.removeEventListener('transitionend', onTransitionEnd);
            focusFirst();
        };

        el.addEventListener('transitionend', onTransitionEnd);

        // Fallback: if no transition fires (e.g. reduced motion), focus immediately
        requestAnimationFrame(focusFirst);

        return () => el.removeEventListener('transitionend', onTransitionEnd);
    }, [searchPanel.isOpen]);

    const mainMenuClasses = classNames(
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
            ref={navRef}
            className="main-menu__nav"
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
                    aria-expanded={searchPanel.isOpen}
                    onClick={handleSearchToggle}
                >
                    <span className="icon icon-search" />
                </button>
            )}
            <button
                className="button button--icon-only"
                aria-label="Menu"
                aria-controls={navId}
                aria-expanded={nav.isOpen}
                onClick={handleMenuToggle}
            >
                <span className="icon icon-menu" />
            </button>
        </div>
    );

    const searchArea = search ? (
        <form
            ref={searchFormRef}
            className="main-menu__search"
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

    // Bar:   logo → nav → toggle → search → actions
    // Stack: logo → toggle → search → actions → nav

    return (
        <div className={mainMenuClasses}>
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
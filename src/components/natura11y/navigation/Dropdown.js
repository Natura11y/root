import React, { useState, useEffect, useRef, useCallback, useId } from 'react';

import classNames from 'classnames';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { getCurrentBreakpoint } from 'natura11y/src/js/utilities/getCurrentBreakpoint';

const HOVER_TIMEOUT = 400;

const Dropdown = (props) => {

    const {
        type = 'dropdown',
        hover = false,
        buttonText = null,
        dataIndicator = null,
        // Link-split mode: renders the dropdown-link-split pattern
        linkSplit = false,
        linkHref = '#1',
        linkText = 'Link',
        linkTag = 'a',
        linkProps = {},
        dropdownId: dropdownIdProp = null,
        utilities = null,
        children
    } = props;

    const uid = useId();
    const dropdownId = dropdownIdProp || `dropdown-${uid.replace(/:/g, '')}`;

    const [menuShow, setMenuShow] = useState(false);
    const menuButton = useRef(null);
    const menuRef = useRef(null);
    const wrapperRef = useRef(null);

    const openedByKbOrClickRef = useRef(false);
    const hoverTimeoutRef = useRef(null);
    const hasHoverListenersRef = useRef(false);
    const menuShowRef = useRef(false);

    useEffect(() => {
        menuShowRef.current = menuShow;
        if (!menuShow) openedByKbOrClickRef.current = false;
    }, [menuShow]);

    const menuClasses = classNames({
        'dropdown__menu': type === 'dropdown',
        'mega-menu--lg box-shadow-1--lg padding-4': type === 'mega',
        'box-shadow-1--lg': linkSplit && type === 'dropdown',
        'shown': menuShow,
        [utilities]: utilities !== null
    });

    const MenuContainer = type === 'mega' ? 'div' : 'ul';

    // Link-split always enables hover on fine-pointer desktop; standard gates on hover prop
    const shouldEnableHover = useCallback(() => {
        const capable = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
            getCurrentBreakpoint().isDesktop;
        return linkSplit ? capable : (hover && capable);
    }, [hover, linkSplit]);

    useEffect(() => {
        const button = menuButton.current;
        const menu = menuRef.current;
        // Link-split uses the wrapper div as the hover/click boundary; standard uses the button
        const triggerContainer = linkSplit ? wrapperRef.current : button;

        if (!button || !menu || !triggerContainer) return;

        const navigateMenu = (direction) => {
            const items = getFocusableElements(menu);
            if (items.length === 0) return;
            const currentIndex = items.indexOf(document.activeElement);
            const nextIndex = direction === 'ArrowDown'
                ? (currentIndex + 1) % items.length
                : (currentIndex - 1 + items.length) % items.length;
            items[nextIndex]?.focus();
        };

        const handleTabNavigation = (e) => {
            const items = getFocusableElements(menu);
            if (document.activeElement === items[items.length - 1] && !e.shiftKey) {
                setMenuShow(false);
                button.closest('li').nextElementSibling?.querySelector('button, a')?.focus();
                e.preventDefault();
            }
        };

        const handleOutsideClick = (e) => {
            if (!menuShowRef.current) return;
            if (!menu.contains(e.target) && !triggerContainer.contains(e.target)) {
                setMenuShow(false);
            }
        };

        const handleWindowKeyDown = (e) => {
            if (e.key === 'Escape' && menuShowRef.current) {
                setMenuShow(false);
                button.focus();
            } else if (menuShowRef.current && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                navigateMenu(e.key);
            } else if (e.key === 'Tab' && menuShowRef.current) {
                handleTabNavigation(e);
            }
        };

        // Only close on focusout when menu is position:absolute (desktop breakpoint)
        const handleFocusout = (e) => {
            if (window.getComputedStyle(menu).position !== 'absolute') return;
            const rel = e.relatedTarget;
            if (rel && !menu.contains(rel) && !triggerContainer.contains(rel)) {
                setMenuShow(false);
            }
        };

        const handleMenuKeyDown = () => { openedByKbOrClickRef.current = true; };

        const handleOtherDropdownOpen = (e) => {
            if (e.detail?.id !== dropdownId && menuShowRef.current) setMenuShow(false);
        };

        window.addEventListener('click', handleOutsideClick);
        window.addEventListener('keydown', handleWindowKeyDown);
        window.addEventListener('dropdown:open', handleOtherDropdownOpen);
        button.addEventListener('focusout', handleFocusout);
        menu.addEventListener('focusout', handleFocusout);
        menu.addEventListener('keydown', handleMenuKeyDown);

        const addHoverListeners = () => {
            if (hasHoverListenersRef.current) return;
            hasHoverListenersRef.current = true;

            const hoverIn = () => {
                if (!openedByKbOrClickRef.current) {
                    window.dispatchEvent(new CustomEvent('dropdown:open', { detail: { id: dropdownId } }));
                    setMenuShow(true);
                }
            };
            const menuHoverIn = () => {
                if (!openedByKbOrClickRef.current) setMenuShow(true);
            };
            const hoverOut = () => {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => {
                    if (!triggerContainer.matches(':hover') && !menu.matches(':hover') && !openedByKbOrClickRef.current) {
                        setMenuShow(false);
                    }
                }, HOVER_TIMEOUT);
            };

            triggerContainer._hoverIn = hoverIn;
            triggerContainer._hoverOut = hoverOut;
            menu._hoverIn = menuHoverIn;
            menu._hoverOut = hoverOut;

            triggerContainer.addEventListener('mouseenter', hoverIn);
            triggerContainer.addEventListener('mouseleave', hoverOut);
            menu.addEventListener('mouseenter', menuHoverIn);
            menu.addEventListener('mouseleave', hoverOut);
        };

        const removeHoverListeners = () => {
            if (!hasHoverListenersRef.current) return;
            if (triggerContainer._hoverIn) {
                triggerContainer.removeEventListener('mouseenter', triggerContainer._hoverIn);
                delete triggerContainer._hoverIn;
            }
            if (triggerContainer._hoverOut) {
                triggerContainer.removeEventListener('mouseleave', triggerContainer._hoverOut);
                delete triggerContainer._hoverOut;
            }
            if (menu._hoverIn) {
                menu.removeEventListener('mouseenter', menu._hoverIn);
                delete menu._hoverIn;
            }
            if (menu._hoverOut) {
                menu.removeEventListener('mouseleave', menu._hoverOut);
                delete menu._hoverOut;
            }
            hasHoverListenersRef.current = false;
        };

        const setupResponsiveHover = () => {
            shouldEnableHover() ? addHoverListeners() : removeHoverListeners();
        };

        setupResponsiveHover();
        window.addEventListener('resize', setupResponsiveHover);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('keydown', handleWindowKeyDown);
            window.removeEventListener('resize', setupResponsiveHover);
            window.removeEventListener('dropdown:open', handleOtherDropdownOpen);
            button.removeEventListener('focusout', handleFocusout);
            menu.removeEventListener('focusout', handleFocusout);
            menu.removeEventListener('keydown', handleMenuKeyDown);
            removeHoverListeners();
            clearTimeout(hoverTimeoutRef.current);
        };
    }, [hover, linkSplit, shouldEnableHover, dropdownId]);

    const handleClick = (e) => {
        if (hasHoverListenersRef.current && e.detail > 0) return;
        openedByKbOrClickRef.current = true;
        setMenuShow(prev => !prev);
    };

    const handleButtonKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            openedByKbOrClickRef.current = true;
        }
    };

    return (
        <>
            {linkSplit ? (
                <div className="dropdown-link-split" ref={wrapperRef}>
                    {React.createElement(linkTag, {
                        href: linkHref,
                        className: 'text',
                        ...linkProps
                    }, linkText)}
                    <button
                        data-toggle="dropdown"
                        ref={menuButton}
                        aria-expanded={menuShow}
                        aria-haspopup="true"
                        aria-controls={dropdownId}
                        onClick={handleClick}
                        onKeyDown={handleButtonKeyDown}
                    />
                </div>
            ) : (
                <button
                    className="dropdown"
                    data-toggle="dropdown"
                    data-hover={hover ? 'true' : undefined}
                    data-indicator={dataIndicator || undefined}
                    ref={menuButton}
                    aria-expanded={menuShow}
                    aria-haspopup="true"
                    aria-controls={dropdownId}
                    onClick={handleClick}
                    onKeyDown={handleButtonKeyDown}
                >
                    {buttonText || (type === 'dropdown' ? 'Dropdown' : 'Mega Menu')}
                </button>
            )}

            <MenuContainer
                ref={menuRef}
                id={dropdownId}
                className={menuClasses}
            >
                {children}
            </MenuContainer>
        </>
    );
};

export default Dropdown;

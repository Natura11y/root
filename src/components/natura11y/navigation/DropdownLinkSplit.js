import React, { useState, useEffect, useRef, useCallback, useId } from 'react';

import classNames from 'classnames';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { getCurrentBreakpoint } from 'natura11y/src/js/utilities/getCurrentBreakpoint';

const HOVER_TIMEOUT = 400;

const DropdownLinkSplit = (props) => {

    const {
        type = 'dropdown',
        href = '#1',
        linkText = 'Link',
        linkTag = 'a',
        linkProps = {},
        dropdownId: dropdownIdProp,
        utilities = null,
        children
    } = props;

    const uid = useId();
    const dropdownId = dropdownIdProp || `dropdown-link-split-${uid.replace(/:/g, '')}`;

    const [menuShow, setMenuShow] = useState(false);
    const menuButton = useRef(null);
    const menuRef = useRef(null);
    const navLink = useRef(null);
    const wrapperRef = useRef(null);

    // Use refs for mutable values to avoid stale closures in event handlers
    const openedByKbOrClickRef = useRef(false);
    const hoverTimeoutRef = useRef(null);
    const hasHoverListenersRef = useRef(false);
    const menuShowRef = useRef(false);

    // Keep menuShowRef in sync; reset flag when menu closes
    useEffect(() => {
        menuShowRef.current = menuShow;
        if (!menuShow) {
            openedByKbOrClickRef.current = false;
        }
    }, [menuShow]);

    const menuClasses = classNames({
        'dropdown__menu': type === 'dropdown',
        'mega-menu--lg box-shadow-1--lg padding-4': type === 'mega',
        'box-shadow-1--lg': type === 'dropdown',
        'shown': menuShow,
        [utilities]: utilities !== null
    });

    const MenuContainer = type === 'mega' ? 'div' : 'ul';

    // dropdown-link-split always enables hover on fine-pointer desktop
    const shouldEnableHover = useCallback(() => {
        return window.matchMedia &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            getCurrentBreakpoint().isDesktop;
    }, []);

    useEffect(() => {
        const button = menuButton.current;
        const menu = menuRef.current;
        const wrapper = wrapperRef.current;

        if (!button || !menu || !wrapper) return;

        const navigateMenu = (direction) => {
            const items = getFocusableElements(menu);
            if (items.length === 0) return;
            const currentIndex = items.indexOf(document.activeElement);
            let nextIndex;
            if (direction === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
            }
            items[nextIndex]?.focus();
        };

        const handleTabNavigation = (e) => {
            const focusableItems = getFocusableElements(menu);
            const lastIndex = focusableItems.length - 1;
            if (document.activeElement === focusableItems[lastIndex] && !e.shiftKey) {
                setMenuShow(false);
                button.closest('li').nextElementSibling?.querySelector('button, a')?.focus();
                e.preventDefault();
            }
        };

        // Outside click: check against the wrapper (contains both link and button)
        const handleOutsideClick = (e) => {
            if (!menuShowRef.current) return;
            if (!menu.contains(e.target) && !wrapper.contains(e.target)) {
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
            const computedStyle = window.getComputedStyle(menu);
            if (computedStyle.position !== 'absolute') return;
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && !menu.contains(relatedTarget) && !wrapper.contains(relatedTarget)) {
                setMenuShow(false);
            }
        };

        // Set flag when user interacts inside the open menu
        const handleMenuKeyDown = () => {
            openedByKbOrClickRef.current = true;
        };

        // Close self when another dropdown announces it is opening
        const handleOtherDropdownOpen = (e) => {
            if (e.detail?.id !== dropdownId && menuShowRef.current) {
                setMenuShow(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);
        window.addEventListener('keydown', handleWindowKeyDown);
        window.addEventListener('dropdown:open', handleOtherDropdownOpen);
        button.addEventListener('focusout', handleFocusout);
        menu.addEventListener('focusout', handleFocusout);
        menu.addEventListener('keydown', handleMenuKeyDown);

        // Hover listeners — hover target is the wrapper div, not just the button
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
                if (!openedByKbOrClickRef.current) {
                    setMenuShow(true);
                }
            };

            const hoverOut = () => {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => {
                    if (!wrapper.matches(':hover') && !menu.matches(':hover') && !openedByKbOrClickRef.current) {
                        setMenuShow(false);
                    }
                }, HOVER_TIMEOUT);
            };

            wrapper._hoverIn = hoverIn;
            wrapper._hoverOut = hoverOut;
            menu._hoverIn = menuHoverIn;
            menu._hoverOut = hoverOut;

            wrapper.addEventListener('mouseenter', hoverIn);
            wrapper.addEventListener('mouseleave', hoverOut);
            menu.addEventListener('mouseenter', menuHoverIn);
            menu.addEventListener('mouseleave', hoverOut);
        };

        const removeHoverListeners = () => {
            if (!hasHoverListenersRef.current) return;

            if (wrapper._hoverIn) {
                wrapper.removeEventListener('mouseenter', wrapper._hoverIn);
                delete wrapper._hoverIn;
            }
            if (wrapper._hoverOut) {
                wrapper.removeEventListener('mouseleave', wrapper._hoverOut);
                delete wrapper._hoverOut;
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
            if (shouldEnableHover()) {
                addHoverListeners();
            } else {
                removeHoverListeners();
            }
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
    }, [shouldEnableHover, dropdownId]);

    const handleDropdownClick = (e) => {
        // Click guard: when hover listeners are active, a real mouse click (detail > 0)
        // should not double-toggle since hover already opened/closed the menu
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
            <div className="dropdown-link-split" ref={wrapperRef}>
                {React.createElement(linkTag, {
                    ref: navLink,
                    href,
                    className: 'text',
                    ...linkProps
                }, linkText)}
                <button
                    data-toggle="dropdown"
                    ref={menuButton}
                    aria-expanded={menuShow}
                    aria-haspopup="true"
                    aria-controls={dropdownId}
                    onClick={handleDropdownClick}
                    onKeyDown={handleButtonKeyDown}
                >
                </button>
            </div>

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

export default DropdownLinkSplit;

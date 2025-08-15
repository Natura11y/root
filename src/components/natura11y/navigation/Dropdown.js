import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';
import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleArrowKeyNavigation } from 'natura11y/src/js/utilities/keyboardNavigation';
import { getCurrentBreakpoint } from 'natura11y/src/js/utilities/getCurrentBreakpoint';

import DropdownMenu from './DropdownMenu';

const Dropdown = ({ 
    title = 'Dropdown',
    children,
    items,
    hover = false
}) => {

    const dropdownButton = useRef();
    const dropdownContent = useRef();
    const hoverTimeoutRef = useRef(null);
    
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const dropdownId = `dropdown-${Math.random().toString(36).substring(2, 11)}`;
    const hoverLeaveTimeout = 400; // 1 second delay for mega-menu leave

    // Close dropdown on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Update ARIA and CSS classes when state changes
    useEffect(() => {
        const button = dropdownButton.current;
        const menu = dropdownContent.current;
        
        if (!button || !menu) return;

        if (isOpen) {
            button.setAttribute('aria-expanded', 'true');
            menu.classList.add('shown');
            menu.setAttribute('aria-hidden', 'false');
            
            // Handle mega-menu overlay
            if (menu.classList.contains('mega-menu')) {
                handleOverlayOpen();
            }
        } else {
            button.setAttribute('aria-expanded', 'false');
            menu.classList.remove('shown');
            menu.setAttribute('aria-hidden', 'true');
            
            // Handle mega-menu overlay
            if (menu.classList.contains('mega-menu')) {
                handleOverlayClose();
            }
        }
    }, [isOpen]);

    // Close other dropdowns when this one opens (React way)
    useEffect(() => {
        if (isOpen) {
            // Close other dropdowns
            document.querySelectorAll('[data-toggle="dropdown"]').forEach((otherButton) => {
                if (otherButton !== dropdownButton.current) {
                    const otherMenuId = otherButton.getAttribute('aria-controls');
                    const otherMenu = document.getElementById(otherMenuId);
                    if (otherMenu?.classList.contains('shown')) {
                        otherMenu.classList.remove('shown');
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherMenu.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        }
    }, [isOpen]);

    // Handle outside clicks (React way)
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const button = dropdownButton.current;
            const menu = dropdownContent.current;
            
            if (!button || !menu || !isOpen) return;
            
            const isClickInside = button.contains(event.target) || menu.contains(event.target);
            
            if (!isClickInside) {
                setIsOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                dropdownButton.current?.focus();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseEnter = () => {
        if (!hover) return;

        // Only on desktop breakpoints
        const { isDesktop } = getCurrentBreakpoint();
        if (!isDesktop) return;

        // Clear any existing leave timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Open immediately - no delay on enter
        setIsOpen(true);
    };

    const handleMouseLeave = (event) => {
        if (!hover) return;

        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Check if moving to dropdown menu
        const menu = dropdownContent.current;
        const button = dropdownButton.current;
        const relatedTarget = event.relatedTarget;
        
        const isMovingToDropdown = menu && (
            menu.contains(relatedTarget) || 
            menu === relatedTarget ||
            button === relatedTarget ||
            button.contains(relatedTarget)
        );

        if (!isMovingToDropdown) {
            // Check if this is a mega-menu (needs delay) or regular dropdown (immediate)
            const isMegaMenu = menu?.classList.contains('mega-menu');
            
            if (isMegaMenu) {
                // Mega-menu: add delay for breathing room
                hoverTimeoutRef.current = setTimeout(() => {
                    setIsOpen(false);
                }, hoverLeaveTimeout);
            } else {
                // Regular dropdown: close immediately
                setIsOpen(false);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (!isOpen) return;

        const menu = dropdownContent.current;
        const focusableElements = getFocusableElements(menu);
        const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

        switch (event.code) {
            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                dropdownButton.current?.focus();
                break;
            
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Home':
            case 'End':
                handleArrowKeyNavigation(
                    event, 
                    currentIndex, 
                    focusableElements, 
                    (targetIndex) => focusableElements[targetIndex]?.focus()
                );
                break;
            
            default:
                break;
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <button
                ref={dropdownButton}
                data-toggle="dropdown"
                data-hover={hover ? "true" : undefined}
                aria-expanded="false"
                aria-controls={dropdownId}
                aria-haspopup="menu"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onKeyDown={handleKeyDown}
            >
                {title}
            </button>

            {/* Support both patterns: items prop or children */}
            {items ? (
                <DropdownMenu 
                    ref={dropdownContent}
                    id={dropdownId}
                    items={items}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            ) : children && React.cloneElement(children, {
                ref: dropdownContent,
                id: dropdownId,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave
            })}
        </>
    );
};

export default Dropdown;
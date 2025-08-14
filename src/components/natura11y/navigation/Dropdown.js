import React, { useRef, useState, useEffect, Fragment } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { getFocusableElements } from '../../../utilities/focus';
import { handleArrowKeyNavigation } from '../../../utilities/keyboardNavigation';

const Dropdown = ({ 
    title = 'Dropdown',
    items = [
        { to: '#1', label: 'One' },
        { to: '#2', label: 'Two' },
        { to: '#3', label: 'Three' }
    ],
    isMegaMenu = false,
    megaMenuBreakpoint = 'lg',
    hover = false
}) => {

    const dropdownButton = useRef();
    const dropdownMenu = useRef();

    const [dropdownShow, setDropdownShow] = useState(false);
    const dropdownMenuId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    const location = useLocation();

    useEffect(() => {
        let dropdownButtonParent = dropdownButton.current.closest('li');

        const dropdownClickListener = (e) => {
            let dropdownButtonClick = dropdownButtonParent.contains(e.target);

            if (!dropdownButtonClick) {
                setDropdownShow(false);
            }
        } 

        window.addEventListener('click', dropdownClickListener);

        return () => {
            window.removeEventListener('click', dropdownClickListener);
        }
    }, []);

    useEffect(() => {
        setDropdownShow(false);
    }, [location]);

    const handleClick = () => {
        setDropdownShow(!dropdownShow);
    }

    const handleKeyDown = (e) => {
        if (!dropdownShow) return;

        const focusableElements = getFocusableElements(dropdownMenu.current);
        const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

        switch (e.code) {
            case 'Escape':
                setDropdownShow(false);
                dropdownButton.current.focus();
                break;
            
            case 'ArrowDown':
            case 'ArrowUp':
            case 'Home':
            case 'End':
                handleArrowKeyNavigation(
                    e, 
                    currentIndex, 
                    focusableElements, 
                    (targetIndex) => focusableElements[targetIndex]?.focus()
                );
                break;
            
            default:
                // do nothing
        }
    };

    useEffect(() => {
        if (dropdownShow) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dropdownShow]);

    const dropdownClasses = isMegaMenu 
        ? `mega-menu mega-menu--${megaMenuBreakpoint} box-shadow-1--lg ${dropdownShow ? 'shown' : ''}`
        : `nav__dropdown box-shadow-1--lg ${dropdownShow ? 'shown' : ''}`;

    return (
        <Fragment>
            <button
                ref={dropdownButton}
                data-toggle="dropdown"
                data-hover={hover ? 'true' : undefined}
                aria-expanded={dropdownShow ? true : false}
                aria-controls={dropdownMenuId}
                aria-haspopup="menu"
                onClick={handleClick}
            >
                {title}
            </button>

            <ul
                ref={dropdownMenu}
                id={dropdownMenuId}
                className={dropdownClasses}
                role="menu"
                aria-hidden={!dropdownShow}
            >
                {items.map((item, index) => (
                    <li key={index} role="menuitem">
                        <Link to={item.to}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
}

export default Dropdown;
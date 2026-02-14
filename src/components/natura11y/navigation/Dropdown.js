import { useRef, useState, useEffect, Fragment } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleArrowKeyNavigation } from 'natura11y/src/js/utilities/keyboardNavigation';

const Dropdown = ({ 
    title = 'Dropdown',
    to = null, // Optional page link
    items = [
        { to: '#1', label: 'One' },
        { to: '#2', label: 'Two' },
        { to: '#3', label: 'Three' }
    ],
    hover = false
}) => {

    const dropdownButton = useRef();
    const dropdownMenu = useRef();

    const [dropdownShow, setDropdownShow] = useState(false);
    const dropdownMenuId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    const location = useLocation();

    useEffect(() => {
        let dropdownButtonParent = dropdownButton.current?.closest('li');

        const dropdownClickListener = (e) => {
            if (!dropdownButtonParent?.contains(e.target)) {
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
                dropdownButton.current?.focus();
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

    // If there's a page link, render as nav-link-dropdown pattern
    if (to) {
        return (
            <div className="nav-link-dropdown">
                <Link to={to}>{title}</Link>
                <button
                    ref={dropdownButton}
                    data-toggle="dropdown"
                    data-hover={hover ? 'true' : undefined}
                    aria-expanded={dropdownShow ? true : false}
                    aria-controls={dropdownMenuId}
                    aria-haspopup="menu"
                    onClick={handleClick}
                >
                    <span className="caret"></span>
                </button>
                
                {items && items.length > 0 && (
                    <ul
                        ref={dropdownMenu}
                        id={dropdownMenuId}
                        className={`nav__dropdown ${dropdownShow ? 'shown' : ''}`}
                        role="menu"
                        aria-hidden={!dropdownShow}
                    >
                        {items.map((item, index) => (
                            <li key={index} role="menuitem">
                                <Link to={item.to}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    // Standard dropdown without page link
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
                className={`nav__dropdown ${dropdownShow ? 'shown' : ''}`}
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
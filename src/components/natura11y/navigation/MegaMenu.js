import React, { useRef, useState, useEffect, Fragment } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { getFocusableElements } from '../../../utilities/focus';
import { handleArrowKeyNavigation } from '../../../utilities/keyboardNavigation';

const MegaMenu = ({ 
    title = 'Mega Menu',
    breakpoint = 'lg',
    children,
    megaMenuContent = null
}) => {

    const megaMenuButton = useRef();
    const megaMenuContainer = useRef();

    const [megaMenuShow, setMegaMenuShow] = useState(false);

    const location = useLocation();

    useEffect(() => {
        let megaMenuButtonParent = megaMenuButton.current.closest('li');

        const megaMenuClickListener = (e) => {
            let megaMenuButtonClick = megaMenuButtonParent.contains(e.target);

            if (!megaMenuButtonClick) {
                setMegaMenuShow(false);
            }
        } 

        window.addEventListener('click', megaMenuClickListener);

        return () => {
            window.removeEventListener('click', megaMenuClickListener);
        }
    }, []);

    useEffect(() => {
        setMegaMenuShow(false);
    }, [location]);

    const handleClick = () => {
        setMegaMenuShow(!megaMenuShow);
    }

    const handleKeyDown = (e) => {
        if (!megaMenuShow) return;

        const focusableElements = getFocusableElements(megaMenuContainer.current);
        const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

        switch (e.code) {
            case 'Escape':
                setMegaMenuShow(false);
                megaMenuButton.current.focus();
                break;
            
            case 'ArrowDown':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
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
        if (megaMenuShow) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [megaMenuShow]);

    const defaultMegaMenuContent = (
        <div className="container">
            <div className="grid grid--column-4--lg">
                <div>
                    <p className="h6">Column One</p>
                    <ul>
                        <li><Link to="#1">Link One</Link></li>
                        <li><Link to="#2">Link Two</Link></li>
                        <li><Link to="#3">Link Three</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="h6">Column Two</p>
                    <ul>
                        <li><Link to="#1">Link One</Link></li>
                        <li><Link to="#2">Link Two</Link></li>
                        <li><Link to="#3">Link Three</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="h6">Column Three</p>
                    <ul>
                        <li><Link to="#1">Link One</Link></li>
                        <li><Link to="#2">Link Two</Link></li>
                        <li><Link to="#3">Link Three</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="h6">Column Four</p>
                    <ul>
                        <li><Link to="#1">Link One</Link></li>
                        <li><Link to="#2">Link Two</Link></li>
                        <li><Link to="#3">Link Three</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            <button
                ref={megaMenuButton}
                data-toggle="mega-menu"
                aria-expanded={megaMenuShow ? true : false}
                aria-haspopup="menu"
                onClick={handleClick}
            >
                {title}
            </button>

            <div
                ref={megaMenuContainer}
                className={`mega-menu mega-menu--${breakpoint} box-shadow-1--lg ${megaMenuShow ? 'shown' : ''}`}
                role="menu"
                aria-hidden={!megaMenuShow}
            >
                {megaMenuContent || children || defaultMegaMenuContent}
            </div>
        </Fragment>
    );
}

export default MegaMenu;
import { useState, useRef } from 'react';

import FlyoutMenu from './index';
import ButtonIconOnly from '../button/ButtonIconOnly';

const FlyoutMenuParent = () => {

    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const panels = [

        // Panel 0: Root
        ({ navigateTo }) => (
            <ul className="nav nav--divider">
                <li>
                    <button data-flyout-menu-next="" onClick={() => navigateTo(1)}>
                        Products
                        <span className="icon icon-arrow-right" aria-hidden="true"></span>
                    </button>
                </li>
                <li>
                    <button data-flyout-menu-next="" onClick={() => navigateTo(2)}>
                        Services
                        <span className="icon icon-arrow-right" aria-hidden="true"></span>
                    </button>
                </li>
                <li><a href="#1">About</a></li>
                <li><a href="#1">Blog</a></li>
                <li><a href="#1">Contact</a></li>
            </ul>
        ),

        // Panel 1: Products
        ({ navigateTo }) => (
            <ul className="nav nav--divider">
                <li>
                    <button data-flyout-menu-next="" onClick={() => navigateTo(3)}>
                        Software
                        <span className="icon icon-arrow-right" aria-hidden="true"></span>
                    </button>
                </li>
                <li><a href="#1">Hardware</a></li>
                <li><a href="#1">Accessories</a></li>
                <li><a href="#1">All Products</a></li>
            </ul>
        ),

        // Panel 2: Services
        () => (
            <ul className="nav nav--divider">
                <li><a href="#1">Consulting</a></li>
                <li><a href="#1">Support</a></li>
                <li><a href="#1">Training</a></li>
                <li><a href="#1">All Services</a></li>
            </ul>
        ),

        // Panel 3: Software (nested under Products)
        () => (
            <ul className="nav nav--divider">
                <li><a href="#1">App One</a></li>
                <li><a href="#1">App Two</a></li>
                <li><a href="#1">App Three</a></li>
                <li><a href="#1">All Software</a></li>
            </ul>
        ),

    ];

    return (
        <>
            <ButtonIconOnly
                ref={triggerRef}
                iconHandle="menu"
                ariaLabel="Open Menu"
                clickHandler={() => setIsOpen(true)}
            />

            <FlyoutMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                label="Main Menu"
                panels={panels}
                triggerRef={triggerRef}
            />
        </>
    );

};

export default FlyoutMenuParent;

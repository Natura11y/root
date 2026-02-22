import { useState, useRef } from 'react';

import Flyout from './index';
import ButtonIconOnly from '../button/ButtonIconOnly';

const FlyoutParent = () => {

    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const panels = [

        // Panel 0: Root
        ({ navigateTo }) => (
            <ul className="nav nav--divider">
                <li>
                    <button data-flyout-next="" onClick={() => navigateTo(1)}>
                        Wildlife
                        <span className="icon icon-arrow-right" aria-hidden="true"></span>
                    </button>
                </li>
                <li>
                    <button data-flyout-next="" onClick={() => navigateTo(2)}>
                        Trails
                        <span className="icon icon-arrow-right" aria-hidden="true"></span>
                    </button>
                </li>
                <li><a href="#1">Events</a></li>
                <li><a href="#1">About</a></li>
                <li><a href="#1">Contact</a></li>
            </ul>
        ),

        // Panel 1: Wildlife
        ({ navigateTo }) => (
            <>
                <div className="flyout__panel-title">
                    <p>Wildlife</p>
                </div>
                <ul className="nav nav--divider">
                    <li>
                        <button data-flyout-next="" onClick={() => navigateTo(3)}>
                            Birds
                            <span className="icon icon-arrow-right" aria-hidden="true"></span>
                        </button>
                    </li>
                    <li>
                        <button data-flyout-next="" onClick={() => navigateTo(4)}>
                            Mammals
                            <span className="icon icon-arrow-right" aria-hidden="true"></span>
                        </button>
                    </li>
                    <li>
                        <button data-flyout-next="" onClick={() => navigateTo(5)}>
                            Reptiles
                            <span className="icon icon-arrow-right" aria-hidden="true"></span>
                        </button>
                    </li>
                    <li><a href="#1">All Wildlife</a></li>
                </ul>
            </>
        ),

        // Panel 2: Trails
        () => (
            <>
                <div className="flyout__panel-title">
                    <p>Trails</p>
                </div>
                <ul className="nav nav--divider">
                    <li><a href="#1">Easy</a></li>
                    <li><a href="#1">Moderate</a></li>
                    <li><a href="#1">Strenuous</a></li>
                    <li><a href="#1">All Trails</a></li>
                </ul>
            </>
        ),

        // Panel 3: Birds (nested under Wildlife)
        () => (
            <>
                <div className="flyout__panel-title">
                    <p>Birds</p>
                </div>
                <ul className="nav nav--divider">
                    <li><a href="#1">Waterfowl</a></li>
                    <li><a href="#1">Raptors</a></li>
                    <li><a href="#1">Shorebirds</a></li>
                    <li><a href="#1">All Birds</a></li>
                </ul>
            </>
        ),

        // Panel 4: Mammals (nested under Wildlife)
        () => (
            <>
                <div className="flyout__panel-title">
                    <p>Mammals</p>
                </div>
                <ul className="nav nav--divider">
                    <li><a href="#1">Bears</a></li>
                    <li><a href="#1">Deer</a></li>
                    <li><a href="#1">Fox</a></li>
                    <li><a href="#1">All Mammals</a></li>
                </ul>
            </>
        ),

        // Panel 5: Reptiles (nested under Wildlife)
        () => (
            <>
                <div className="flyout__panel-title">
                    <p>Reptiles</p>
                </div>
                <ul className="nav nav--divider">
                    <li><a href="#1">Turtles</a></li>
                    <li><a href="#1">Lizards</a></li>
                    <li><a href="#1">Snakes</a></li>
                    <li><a href="#1">All Reptiles</a></li>
                </ul>
            </>
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

            <Flyout
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                label="Main Menu"
                panels={panels}
                triggerRef={triggerRef}
            />
        </>
    );

};

export default FlyoutParent;

import { useState } from 'react';

import Flyout from '../../natura11y/flyout';
import Button from '../../natura11y/button';

// ─────────────────────────────────────────────────────────────
// Simple Flyout
// A flat list of links — no drill-down, just open and close.
// ─────────────────────────────────────────────────────────────

const SimpleFlyout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="narrow">
                <Button
                    title="Flyout Menu"
                    iconStartHandle="menu"
                    onClick={() => setIsOpen(true)}
                    attributes={{ 'aria-expanded': isOpen }}
                />
            </div>

            <Flyout
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                label="Menu"
            >
                <ul className="nav nav--divider">
                    <li><a href="#1">Home</a></li>
                    <li><a href="#1">Trails</a></li>
                    <li><a href="#1">Wildlife</a></li>
                    <li><a href="#1">Events</a></li>
                    <li><a href="#1">About</a></li>
                    <li><a href="#1">Contact</a></li>
                </ul>
            </Flyout>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// Flyout with Drill-Down Navigation
// Each panel is a render function that receives navigateTo(index).
// Call navigateTo with a panel index to go deeper.
// The back button appears automatically once the user drills in.
// ─────────────────────────────────────────────────────────────

const DrillDownFlyout = () => {
    const [isOpen, setIsOpen] = useState(false);

    const panels = [

        // Panel 0 — Root
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

        // Panel 1 — Wildlife
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

        // Panel 2 — Trails
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

        // Panel 3 — Birds
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

        // Panel 4 — Mammals
        () => (
            <>
                <div className="flyout__panel-title">
                    <p>Mammals</p>
                </div>
                <ul className="nav nav--divider">
                    <li><a href="#1">Bears</a></li>
                    <li><a href="#1">Deer</a></li>
                    <li><a href="#1">Foxes</a></li>
                    <li><a href="#1">All Mammals</a></li>
                </ul>
            </>
        ),

        // Panel 5 — Reptiles
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
            <div className="narrow">
                <Button
                    title="Flyout Menu with Drill Down"
                    iconStartHandle="menu"
                    onClick={() => setIsOpen(true)}
                    attributes={{ 'aria-expanded': isOpen }}
                />
            </div>

            <Flyout
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                label="Main Menu"
                panels={panels}
            />
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// FlyoutExamples — shown on the /flyout detail page
// ─────────────────────────────────────────────────────────────

const FlyoutExamples = () => {
    return (
        <div className="container narrow margin-y-5">
            <div className="margin-y-4">
                <SimpleFlyout />
            </div>
            <div className="margin-y-4">
                <DrillDownFlyout />
            </div>
        </div>
    );
};

export default FlyoutExamples;

import { useState } from 'react';

import Flyout from '@lib/components/flyout';
import Button from '@lib/components/button';

// ─────────────────────────────────────────────────────────────
// Simple Flyout
// Plain children — no drill-down.
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
// Use <Flyout.Panel> children to enable multi-level nav.
// Multiple panels = drill-down mode. Back button appears
// automatically. Each panel accepts a render prop for navigateTo.
// ─────────────────────────────────────────────────────────────

const DrillDownFlyout = () => {
    const [isOpen, setIsOpen] = useState(false);

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
            >
                {/* Panel 0 — Root */}
                <Flyout.Panel>
                    {({ navigateTo }) => (
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
                    )}
                </Flyout.Panel>

                {/* Panel 1 — Wildlife */}
                <Flyout.Panel>
                    {({ navigateTo }) => (
                        <>
                            <div className="flyout__panel-title"><p>Wildlife</p></div>
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
                    )}
                </Flyout.Panel>

                {/* Panel 2 — Trails */}
                <Flyout.Panel>
                    <div className="flyout__panel-title"><p>Trails</p></div>
                    <ul className="nav nav--divider">
                        <li><a href="#1">Easy</a></li>
                        <li><a href="#1">Moderate</a></li>
                        <li><a href="#1">Strenuous</a></li>
                        <li><a href="#1">All Trails</a></li>
                    </ul>
                </Flyout.Panel>

                {/* Panel 3 — Birds */}
                <Flyout.Panel>
                    <div className="flyout__panel-title"><p>Birds</p></div>
                    <ul className="nav nav--divider">
                        <li><a href="#1">Waterfowl</a></li>
                        <li><a href="#1">Raptors</a></li>
                        <li><a href="#1">Shorebirds</a></li>
                        <li><a href="#1">All Birds</a></li>
                    </ul>
                </Flyout.Panel>

                {/* Panel 4 — Mammals */}
                <Flyout.Panel>
                    <div className="flyout__panel-title"><p>Mammals</p></div>
                    <ul className="nav nav--divider">
                        <li><a href="#1">Bears</a></li>
                        <li><a href="#1">Deer</a></li>
                        <li><a href="#1">Foxes</a></li>
                        <li><a href="#1">All Mammals</a></li>
                    </ul>
                </Flyout.Panel>

                {/* Panel 5 — Reptiles */}
                <Flyout.Panel>
                    <div className="flyout__panel-title"><p>Reptiles</p></div>
                    <ul className="nav nav--divider">
                        <li><a href="#1">Turtles</a></li>
                        <li><a href="#1">Lizards</a></li>
                        <li><a href="#1">Snakes</a></li>
                        <li><a href="#1">All Reptiles</a></li>
                    </ul>
                </Flyout.Panel>
            </Flyout>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// FlyoutExamples — shown on the /flyout detail page
// ─────────────────────────────────────────────────────────────

const FlyoutExamples = () => (
    <div className="container narrow margin-y-5">
        <div className="margin-y-4">
            <SimpleFlyout />
        </div>
        <div className="margin-y-4">
            <DrillDownFlyout />
        </div>
    </div>
);

export default FlyoutExamples;

import { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import ButtonIconOnly from '../button/ButtonIconOnly';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';

/*
 * Flyout
 *
 * A full-height overlay panel that slides in from the side.
 * A trigger button anywhere on the page opens it.
 * Close it with the X button, the Escape key, or clicking outside.
 *
 * Props:
 *   isOpen      {boolean}  Controls whether the flyout is visible. Required.
 *   onClose     {function} Called when the user wants to close. Required.
 *   label       {string}   Accessible name for the dialog and inner nav.
 *   children    {node}     Simple content — use this for a flat nav or any off-canvas content.
 *   panels      {array}    Render-function array for drill-down navigation (see below).
 *                          When provided, children is ignored.
 *   triggerRef  {ref}      Optional ref to the button that opened the flyout.
 *                          Enables auto-close when the trigger is hidden (e.g. at a breakpoint).
 *   utilities   {string}   Extra CSS utility classes on the outer flyout element.
 *
 * Drill-down panels:
 *   Each item in the panels array is a render function: ({ navigateTo }) => JSX
 *   Panel 0 is the root. Call navigateTo(index) from a button to go deeper.
 *   The back button appears automatically once the user has drilled in.
 *   Inactive panels receive the HTML inert attribute — keyboard and screen readers skip them.
 *
 * Example — simple:
 *   <Flyout isOpen={isOpen} onClose={close} label="Menu">
 *     <ul className="nav nav--divider">
 *       <li><a href="/about">About</a></li>
 *     </ul>
 *   </Flyout>
 *
 * Example — drill-down:
 *   const panels = [
 *     ({ navigateTo }) => (
 *       <ul>
 *         <li><button onClick={() => navigateTo(1)}>Products</button></li>
 *       </ul>
 *     ),
 *     () => <ul><li><a href="/products/shoes">Shoes</a></li></ul>,
 *   ];
 *   <Flyout isOpen={isOpen} onClose={close} label="Menu" panels={panels} />
 */

const Flyout = (props) => {

    const {
        isOpen = false,
        onClose = null,
        label = 'Main Menu',
        panels = null,
        children = null,
        triggerRef = null,
        utilities = null,
    } = props;

    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const panelRefs = useRef([]);

    // Stored as a ref so updating it never causes a re-render.
    // It only needs to tell the panel effect which panel to animate in.
    const enteringIndexRef = useRef(null);

    // Track previous isOpen so we only steal focus on the closed → open transition.
    const prevIsOpen = useRef(isOpen);

    const [activePanelIndex, setActivePanelIndex] = useState(0);
    const [panelHistory, setPanelHistory] = useState([]);

    // Show the back button only when inside a drill-down with navigation history.
    const showBack = panels !== null && panelHistory.length > 0;

    // ─── Panel visibility: inert + enter animation ───────────────────────────
    // The CSS hides panels via [inert] { visibility: hidden } and shows the
    // active one via :not([inert]) { z-index: 1 }.
    // This effect sets those attributes after every panel change or open event.
    // isOpen is included so the initial open (activePanelIndex stays 0 → 0)
    // still triggers this and correctly marks panels 1-N as inert.

    useEffect(() => {
        if (!panels) return;

        panelRefs.current.forEach((el, index) => {
            if (!el) return;

            if (index === activePanelIndex) {
                el.removeAttribute('inert');

                if (enteringIndexRef.current === index) {
                    enteringIndexRef.current = null;
                    el.setAttribute('data-entering', '');
                    const onAnimEnd = () => {
                        el.removeAttribute('data-entering');
                        el.removeEventListener('animationend', onAnimEnd);
                    };
                    el.addEventListener('animationend', onAnimEnd);
                }
            } else {
                el.setAttribute('inert', '');
            }
        });
    }, [activePanelIndex, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Reset drill-down state on close ────────────────────────────────────

    useEffect(() => {
        if (!isOpen) {
            setActivePanelIndex(0);
            setPanelHistory([]);
            enteringIndexRef.current = null;
        }
    }, [isOpen]);

    // ─── Page scroll lock ────────────────────────────────────────────────────

    useEffect(() => {
        if (!containerRef.current) return;

        if (isOpen) {
            handleOverlayOpen(null, null, null);
        } else {
            handleOverlayClose(containerRef.current);
        }

        return () => {
            if (containerRef.current) handleOverlayClose(containerRef.current);
        };
    }, [isOpen]);

    // ─── Move focus into the flyout on open ─────────────────────────────────

    useEffect(() => {
        const wasOpen = prevIsOpen.current;
        prevIsOpen.current = isOpen;

        if (isOpen && !wasOpen && contentRef.current) {
            contentRef.current.querySelector('[data-flyout-close]')?.focus();
        }
    }, [isOpen]);

    // ─── Focus trap + Escape key ─────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen || !contentRef.current) return;

        const handleKeyDown = (e) => {
            if (e.code === 'Escape') {
                onClose?.();
                return;
            }

            if (e.key === 'Tab') {
                const focusable = getFocusableElements(contentRef.current)
                    .filter(el => !el.closest('[inert]'));
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // ─── Auto-close when the trigger is hidden ───────────────────────────────

    useEffect(() => {
        if (!triggerRef?.current) return;

        const trigger = triggerRef.current;

        const observer = new ResizeObserver(() => {
            if (isOpen && !trigger.offsetWidth) onClose?.();
        });

        observer.observe(trigger);

        return () => observer.disconnect();
    }, [triggerRef, isOpen, onClose]);

    // ─── Drill-down navigation ───────────────────────────────────────────────

    const navigateTo = (index) => {
        enteringIndexRef.current = index;
        setPanelHistory(prev => [...prev, activePanelIndex]);
        setActivePanelIndex(index);

        setTimeout(() => {
            contentRef.current?.querySelector('[data-flyout-back]')?.focus({ preventScroll: true });
        }, 0);
    };

    const navigateBack = () => {
        if (!panelHistory.length) return;

        const newHistory = [...panelHistory];
        const prevIndex = newHistory.pop();

        enteringIndexRef.current = prevIndex;
        setPanelHistory(newHistory);
        setActivePanelIndex(prevIndex);

        setTimeout(() => {
            const selector = newHistory.length > 0 ? '[data-flyout-back]' : '[data-flyout-close]';
            contentRef.current?.querySelector(selector)?.focus({ preventScroll: true });
        }, 0);
    };

    const handleBackdropClick = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
            onClose?.();
        }
    };

    const containerClasses = classNames(
        'flyout',
        { 'shown': isOpen },
        { [`${utilities}`]: utilities !== null }
    );

    return (
        <div
            ref={containerRef}
            className={containerClasses}
            aria-hidden={!isOpen}
            onClick={handleBackdropClick}
        >
            <div
                ref={contentRef}
                className="flyout__content"
                role="dialog"
                aria-modal="true"
                aria-label={label}
            >
                <div className="flyout__header">

                    {showBack && (
                        <ButtonIconOnly
                            iconHandle="arrow-left"
                            ariaLabel="Back"
                            utilities="font-size-md"
                            clickHandler={navigateBack}
                            attributes={{ 'data-flyout-back': '' }}
                        />
                    )}

                    <ButtonIconOnly
                        iconHandle="close"
                        ariaLabel="Close Menu"
                        utilities="font-size-md"
                        clickHandler={onClose}
                        attributes={{ 'data-flyout-close': '' }}
                    />

                </div>

                <nav className="flyout__body" aria-label={`${label} Navigation`}>

                    {panels ? (
                        <div className="flyout__panels">
                            {panels.map((renderPanel, index) => (
                                <div
                                    key={index}
                                    ref={el => panelRefs.current[index] = el}
                                    className="flyout__panel"
                                >
                                    {renderPanel({ navigateTo })}
                                </div>
                            ))}
                        </div>
                    ) : children}

                </nav>

            </div>

        </div>
    );

};

export default Flyout;

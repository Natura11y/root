import { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import ButtonIconOnly from '../button/ButtonIconOnly';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';

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
    const enteringIndexRef = useRef(null);
    const prevIsOpen = useRef(isOpen);

    const [activePanelIndex, setActivePanelIndex] = useState(0);
    const [panelHistory, setPanelHistory] = useState([]);

    const showBack = panels !== null && panelHistory.length > 0;

    // Set inert on inactive panels and trigger enter animation on the active one.
    // isOpen is a dep so this fires on first open even when activePanelIndex stays 0.

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

    // Reset to root panel on close

    useEffect(() => {
        if (!isOpen) {
            setActivePanelIndex(0);
            setPanelHistory([]);
            enteringIndexRef.current = null;
        }
    }, [isOpen]);

    // Scroll lock

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

    // Focus close button on open (only on closed → open transition)

    useEffect(() => {
        const wasOpen = prevIsOpen.current;
        prevIsOpen.current = isOpen;

        if (isOpen && !wasOpen && contentRef.current) {
            contentRef.current.querySelector('[data-flyout-close]')?.focus();
        }
    }, [isOpen]);

    // Focus trap + Escape

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

    // Auto-close when trigger is hidden (e.g. breakpoint change)

    useEffect(() => {
        if (!triggerRef?.current) return;

        const trigger = triggerRef.current;

        const observer = new ResizeObserver(() => {
            if (isOpen && !trigger.offsetWidth) onClose?.();
        });

        observer.observe(trigger);

        return () => observer.disconnect();
    }, [triggerRef, isOpen, onClose]);

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
        utilities
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

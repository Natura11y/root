import { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import ButtonIconOnly from '../button/ButtonIconOnly';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';

const FlyoutMenu = (props) => {

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

    const [activePanelIndex, setActivePanelIndex] = useState(0);
    const [panelHistory, setPanelHistory] = useState([]);
    const [enteringPanel, setEnteringPanel] = useState(null);

    const showBack = panelHistory.length > 0;

    // Reset panel state when menu closes

    useEffect(() => {
        if (!isOpen) {
            setActivePanelIndex(0);
            setPanelHistory([]);
            setEnteringPanel(null);
        }
    }, [isOpen]);

    // Overlay open/close

    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        if (isOpen) {
            const closeBtn = contentRef.current.querySelector('[data-flyout-menu-close]');
            handleOverlayOpen(contentRef.current, null, closeBtn);
        } else {
            handleOverlayClose(containerRef.current);
        }

        return () => {
            if (containerRef.current) handleOverlayClose(containerRef.current);
        };
    }, [isOpen]);

    // Escape key

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.code === 'Escape') onClose?.();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // ResizeObserver: close when trigger element is hidden

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
        setPanelHistory(prev => [...prev, activePanelIndex]);
        setActivePanelIndex(index);
        setEnteringPanel(index);

        setTimeout(() => {
            const panel = panelRefs.current[index];
            if (panel) {
                getFocusableElements(panel)[0]?.focus({ preventScroll: true });
            }
        }, 0);
    };

    const navigateBack = () => {
        if (!panelHistory.length) return;

        const newHistory = [...panelHistory];
        const prevIndex = newHistory.pop();

        setPanelHistory(newHistory);
        setActivePanelIndex(prevIndex);
        setEnteringPanel(prevIndex);

        setTimeout(() => {
            const panel = panelRefs.current[prevIndex];
            if (panel) {
                getFocusableElements(panel)[0]?.focus({ preventScroll: true });
            }
        }, 0);
    };

    const handleBackdropClick = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
            onClose?.();
        }
    };

    const containerClasses = classNames(
        'flyout-menu',
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
                className="flyout-menu__content"
                role="dialog"
                aria-modal="true"
                aria-label={label}
            >
                <div className="flyout-menu__header">

                    {showBack && (
                        <ButtonIconOnly
                            iconHandle="arrow-left"
                            ariaLabel="Back"
                            utilities="font-size-md"
                            clickHandler={navigateBack}
                            attributes={{ 'data-flyout-menu-back': '' }}
                        />
                    )}

                    <ButtonIconOnly
                        iconHandle="close"
                        ariaLabel="Close Menu"
                        utilities="font-size-md"
                        clickHandler={onClose}
                        attributes={{ 'data-flyout-menu-close': '' }}
                    />

                </div>

                <nav className="flyout-menu__body" aria-label={`${label} Navigation`}>

                    {panels ? (
                        <div className="flyout-menu__panels">
                            {panels.map((renderPanel, index) => (
                                <div
                                    key={index}
                                    ref={el => panelRefs.current[index] = el}
                                    className={`flyout-menu__panel${activePanelIndex === index ? ' flyout-menu__panel--active' : enteringPanel !== index ? ' flyout-menu__panel--hidden' : ''}`}
                                    data-entering={enteringPanel === index ? '' : undefined}
                                    onAnimationEnd={() => setEnteringPanel(null)}
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

export default FlyoutMenu;

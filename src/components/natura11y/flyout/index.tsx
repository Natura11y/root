import React, { useState, useEffect, useRef, useCallback, createContext, useContext, type RefObject, type ReactNode } from 'react';
import classNames from 'classnames';
import ButtonIconOnly from '../button/ButtonIconOnly';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

// ─── FlyoutPanel ──────────────────────────────────────────────────────────────
// Marker component. When Flyout detects these as children it switches into
// drill-down mode. Each panel accepts plain children or a render prop for
// access to navigateTo.

export interface FlyoutPanelProps {
  children: ReactNode | ((props: { navigateTo: (index: number) => void }) => ReactNode);
}

export const FlyoutPanel = (_props: FlyoutPanelProps): null => null;

// ─── FlyoutContext ────────────────────────────────────────────────────────────
// Gives any nested button access to navigateTo without prop drilling.

interface FlyoutContextValue {
  navigateTo: (index: number) => void;
}

const FlyoutContext = createContext<FlyoutContextValue | null>(null);

export const useFlyoutContext = () => {
  const ctx = useContext(FlyoutContext);
  if (!ctx) throw new Error('useFlyoutContext must be used within a Flyout');
  return ctx;
};

// ─── Flyout ───────────────────────────────────────────────────────────────────

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: (() => void) | null;
  label?: string;
  children?: ReactNode;
  triggerRef?: RefObject<HTMLElement | null> | null;
  utilities?: string | null;
}

const Flyout = ({
  isOpen = false,
  onClose = null,
  label = 'Main Menu',
  children = null,
  triggerRef = null,
  utilities = null,
}: FlyoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const enteringIndexRef = useRef<number | null>(null);
  const prevIsOpen = useRef(isOpen);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const childArray = React.Children.toArray(children);
  const panelChildren = childArray.filter(
    child => React.isValidElement(child) && child.type === FlyoutPanel
  ) as React.ReactElement<FlyoutPanelProps>[];
  const isPanelMode = panelChildren.length > 0;
  const showBack = isPanelMode && history.length > 0;

  useScrollLock(isOpen);
  useFocusTrap(contentRef, { enabled: isOpen, onEscape: onClose ?? undefined });

  // Panel inert + enter animation
  useEffect(() => {
    if (!isPanelMode) return;
    panelRefs.current.forEach((el, index) => {
      if (!el) return;
      if (index === activeIndex) {
        el.removeAttribute('inert');
        if (enteringIndexRef.current === index) {
          enteringIndexRef.current = null;
          el.setAttribute('data-entering', '');
          el.addEventListener('animationend', () => el.removeAttribute('data-entering'), { once: true });
        }
      } else {
        el.setAttribute('inert', '');
      }
    });
  }, [activeIndex, isOpen, isPanelMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus management + panel reset on open
  useEffect(() => {
    const wasOpen = prevIsOpen.current;
    prevIsOpen.current = isOpen;

    if (isOpen && !wasOpen) {
      setActiveIndex(0);
      setHistory([]);
      enteringIndexRef.current = null;
      lastFocusedRef.current = document.activeElement as HTMLElement;
      (contentRef.current?.querySelector('[data-flyout-close]') as HTMLElement | null)?.focus();
    } else if (!isOpen && wasOpen) {
      lastFocusedRef.current?.focus();
    }
  }, [isOpen]);

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

  const navigateTo = (index: number) => {
    enteringIndexRef.current = index;
    setHistory(prev => [...prev, activeIndex]);
    setActiveIndex(index);
    setTimeout(() => {
      (contentRef.current?.querySelector('[data-flyout-back]') as HTMLElement | null)
        ?.focus({ preventScroll: true });
    }, 0);
  };

  const navigateBack = useCallback(() => {
    setHistory(prev => {
      if (!prev.length) return prev;
      const newHistory = [...prev];
      const prevIndex = newHistory.pop()!;
      enteringIndexRef.current = prevIndex;
      setActiveIndex(prevIndex);
      const selector = newHistory.length > 0 ? '[data-flyout-back]' : '[data-flyout-close]';
      setTimeout(() => {
        (contentRef.current?.querySelector(selector) as HTMLElement | null)
          ?.focus({ preventScroll: true });
      }, 0);
      return newHistory;
    });
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
      onClose?.();
    }
  };

  const containerClasses = classNames('flyout', { 'shown': isOpen }, utilities);

  return (
    <FlyoutContext.Provider value={{ navigateTo }}>
      <div
        className={containerClasses}
        data-state={isOpen ? 'open' : 'closed'}
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
                onClick={navigateBack}
                attributes={{ 'data-flyout-back': '' }}
              />
            )}
            <ButtonIconOnly
              iconHandle="close"
              ariaLabel="Close Menu"
              utilities="font-size-md"
              onClick={onClose ?? undefined}
              attributes={{ 'data-flyout-close': '' }}
            />
          </div>

          <nav className="flyout__body" aria-label={`${label} Navigation`}>
            {isPanelMode ? (
              <div className="flyout__panels">
                {panelChildren.map((child, index) => {
                  const { children: panelContent } = child.props;
                  return (
                    <div
                      key={index}
                      ref={el => { panelRefs.current[index] = el; }}
                      className="flyout__panel"
                    >
                      {typeof panelContent === 'function' ? panelContent({ navigateTo }) : panelContent}
                    </div>
                  );
                })}
              </div>
            ) : children}
          </nav>
        </div>
      </div>
    </FlyoutContext.Provider>
  );
};

Flyout.Panel = FlyoutPanel;

export default Flyout;

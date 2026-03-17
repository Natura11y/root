import { useState, useEffect, useRef, type RefObject, type ReactNode } from 'react';
import classNames from 'classnames';
import ButtonIconOnly from '../button/ButtonIconOnly';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

interface FlyoutProps {
  isOpen?: boolean;
  onClose?: (() => void) | null;
  label?: string;
  panels?: ((props: { navigateTo: (index: number) => void }) => ReactNode)[] | null;
  children?: ReactNode;
  triggerRef?: RefObject<HTMLElement | null> | null;
  utilities?: string | null;
}

const Flyout = ({
  isOpen = false,
  onClose = null,
  label = 'Main Menu',
  panels = null,
  children = null,
  triggerRef = null,
  utilities = null,
}: FlyoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const enteringIndexRef = useRef<number | null>(null);
  const prevIsOpen = useRef(isOpen);

  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [panelHistory, setPanelHistory] = useState<number[]>([]);

  const showBack = panels !== null && panelHistory.length > 0;

  useScrollLock(isOpen);
  useFocusTrap(contentRef, { enabled: isOpen, onEscape: onClose ?? undefined });

  // Set inert on inactive panels and trigger enter animation on the active one
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

  // Focus close button on open (only on closed → open transition)
  useEffect(() => {
    const wasOpen = prevIsOpen.current;
    prevIsOpen.current = isOpen;

    if (isOpen && !wasOpen && contentRef.current) {
      (contentRef.current.querySelector('[data-flyout-close]') as HTMLElement | null)?.focus();
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
    setPanelHistory(prev => [...prev, activePanelIndex]);
    setActivePanelIndex(index);

    setTimeout(() => {
      (contentRef.current?.querySelector('[data-flyout-back]') as HTMLElement | null)?.focus({ preventScroll: true });
    }, 0);
  };

  const navigateBack = () => {
    if (!panelHistory.length) return;

    const newHistory = [...panelHistory];
    const prevIndex = newHistory.pop()!;

    enteringIndexRef.current = prevIndex;
    setPanelHistory(newHistory);
    setActivePanelIndex(prevIndex);

    setTimeout(() => {
      const selector = newHistory.length > 0 ? '[data-flyout-back]' : '[data-flyout-close]';
      (contentRef.current?.querySelector(selector) as HTMLElement | null)?.focus({ preventScroll: true });
    }, 0);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
      onClose?.();
    }
  };

  const containerClasses = classNames('flyout', { 'shown': isOpen }, utilities);

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
          {panels ? (
            <div className="flyout__panels">
              {panels.map((renderPanel, index) => (
                <div
                  key={index}
                  ref={el => { panelRefs.current[index] = el; }}
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
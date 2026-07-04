import { useRef, useEffect, type Ref, type ReactNode } from 'react';
import classNames from 'classnames';
import { getFocusableElements } from '@natura11y/core/utilities/focus';
import { useMergedRefs } from '../../hooks/useMergedRefs';

interface CollapseProps {
  ref?: Ref<HTMLDivElement>;
  isOpen?: boolean;
  onClose?: (() => void) | null;
  focusFirst?: boolean;
  utilities?: string | null;
  children?: ReactNode;
}

const Collapse = ({
  ref,
  isOpen = false,
  onClose = null,
  focusFirst = false,
  utilities = null,
  children,
}: CollapseProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(internalRef, ref);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    if (isOpen) {
      el.setAttribute('data-active', '');
      el.classList.add('shown');

      if (focusFirst) {
        const [firstFocusable] = getFocusableElements(el);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          el.tabIndex = -1;
          el.focus();
        }
      }
    } else {
      el.removeAttribute('tabindex');
      el.classList.remove('shown');

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        el.removeAttribute('data-active');
      } else {
        const onEnd = (e: TransitionEvent) => {
          if (!['height', 'grid-template-rows'].includes(e.propertyName)) return;
          el.removeAttribute('data-active');
        };
        el.addEventListener('transitionend', onEnd, { once: true });
        return () => el.removeEventListener('transitionend', onEnd);
      }
    }
  }, [isOpen, focusFirst]);

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const el = internalRef.current;
    if (!el) return;

    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };

    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <div
      ref={mergedRef}
      className={classNames('collapse', utilities)}
      data-state={isOpen ? 'open' : 'closed'}
      inert={!isOpen ? true : undefined}
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  );
};

export default Collapse;
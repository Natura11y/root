import { useRef, type Ref, type ReactNode } from 'react';
import classNames from 'classnames';
import { useCollapse } from '../../hooks/useCollapse';
import { useMergedRefs } from '../../hooks/useMergedRefs';

type ShowAtBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface CollapseProps {
  ref?: Ref<HTMLDivElement>;
  id?: string | null;
  isOpen?: boolean;
  showAt?: ShowAtBreakpoint | null;
  onClose?: (() => void) | null;
  focusFirst?: boolean;
  utilities?: string | null;
  children?: ReactNode;
}

const Collapse = ({
  ref,
  id = null,
  isOpen = false,
  showAt = null,
  onClose = null,
  focusFirst = false,
  utilities = null,
  children,
}: CollapseProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(internalRef, ref);
  const { isVisible, onKeyDown } = useCollapse({
    panelRef: internalRef,
    isOpen,
    onClose,
    focusOnOpen: focusFirst ? 'first' : null,
    showAt,
  });

  return (
    <div
      ref={mergedRef}
      id={id ?? undefined}
      className={classNames('collapse', showAt && `shown--${showAt}`, utilities)}
      data-state={isVisible ? 'open' : 'closed'}
      inert={!isVisible ? true : undefined}
      aria-hidden={!isVisible}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

export default Collapse;

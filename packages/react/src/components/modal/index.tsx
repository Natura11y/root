import { useRef, useId, useEffect, type Ref, type ReactNode, type MouseEvent } from 'react';
import classNames from 'classnames';
import ButtonIconOnly from '../button/ButtonIconOnly';
import { useMergedRefs } from '../../hooks/useMergedRefs';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { getFocusableElements } from '@natura11y/core/utilities/focus';

interface ModalProps {
  ref?: Ref<HTMLDivElement>;
  isOpen?: boolean;
  scrollAll?: boolean;
  closeOutside?: boolean;
  title?: string;
  onClose?: (() => void) | null;
  children?: ReactNode;
  footerContent?: ReactNode;
  modalUtilities?: string | null;
  modalContentUtilities?: string | null;
}

const Modal = ({
  ref,
  isOpen = false,
  scrollAll = false,
  closeOutside = false,
  title = 'Modal Title',
  onClose = null,
  children = <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>,
  footerContent = null,
  modalUtilities = null,
  modalContentUtilities = null,
}: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const mergedRef = useMergedRefs(containerRef, ref);

  useScrollLock(isOpen);
  useFocusTrap(contentRef, { enabled: isOpen, onEscape: onClose ?? undefined });

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const first = getFocusableElements(contentRef.current)[0] as HTMLElement | undefined;
    first?.focus();
  }, [isOpen]);

  const handleCloseOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOutside && contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  return (
    <div
      ref={mergedRef}
      className={classNames('modal', { 'modal--scroll-all': scrollAll, 'shown': isOpen }, modalUtilities)}
      data-state={isOpen ? 'open' : 'closed'}
      aria-hidden={!isOpen}
      onClick={handleCloseOutside}
    >
      <div
        ref={contentRef}
        className={classNames('modal__content', 'border-radius-2', 'box-shadow-3', modalContentUtilities)}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
      >
        <header className='modal__content__head border-bottom'>
          <h2 id={titleId}>{title}</h2>
          <ButtonIconOnly
            buttonType='button'
            iconHandle='close'
            ariaLabel='Close Modal Window'
            utilities='font-size-md'
            onClick={onClose ?? undefined}
          />
        </header>

        <main className='modal__content__body flex-grow-1'>
          {children}
        </main>

        {footerContent && (
          <footer className='modal__content__foot border-top'>
            {footerContent}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;

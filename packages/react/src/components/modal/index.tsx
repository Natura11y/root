import {
  useRef,
  useId,
  useEffect,
  type Ref,
  type RefObject,
  type ReactNode,
  type MouseEvent,
} from 'react';
import classNames from 'classnames';
import ButtonIconOnly from '../button/ButtonIconOnly';
import { useMergedRefs } from '../../hooks/useMergedRefs';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { getFocusableElements } from '@natura11y/core/utilities/focus';

interface ModalProps {
  ref?: Ref<HTMLDivElement>;
  id?: string;
  isOpen?: boolean;
  scrollAll?: boolean;
  closeOutside?: boolean;
  title?: string;
  onClose?: (() => void) | null;
  children?: ReactNode;
  footerContent?: ReactNode;
  modalUtilities?: string | null;
  modalContentUtilities?: string | null;
  titleUtilities?: string | null;
  footerUtilities?: string | null;
  initialFocusRef?: RefObject<HTMLElement | null> | null;
  returnFocusRef?: RefObject<HTMLElement | null> | null;
  closeButtonLabel?: string;
}

const Modal = ({
  ref,
  id,
  isOpen = false,
  scrollAll = false,
  closeOutside = false,
  title = 'Modal Title',
  onClose = null,
  children = <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>,
  footerContent = null,
  modalUtilities = null,
  modalContentUtilities = null,
  titleUtilities = 'h6',
  footerUtilities = null,
  initialFocusRef = null,
  returnFocusRef = null,
  closeButtonLabel = 'Close Modal Window',
}: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const mergedRef = useMergedRefs(containerRef, ref);
  const wasOpenRef = useRef(isOpen);

  useScrollLock(isOpen);
  useFocusTrap(contentRef, { enabled: isOpen, onEscape: onClose ?? undefined });

  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const first = initialFocusRef?.current
      ?? getFocusableElements(contentRef.current)[0] as HTMLElement | undefined;
    first?.focus();
  }, [initialFocusRef, isOpen]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      returnFocusRef?.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, returnFocusRef]);

  const handleCloseOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (closeOutside && contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  return (
    <div
      ref={mergedRef}
      id={id}
      className={classNames('modal', { 'modal--scroll-all': scrollAll, 'shown': isOpen }, modalUtilities)}
      data-state={isOpen ? 'open' : 'closed'}
      aria-hidden={!isOpen}
      inert={isOpen ? undefined : true}
      onClick={handleCloseOutside}
    >
      <div
        ref={contentRef}
        className={classNames('modal__content', 'border-radius-2', 'box-shadow-3', modalContentUtilities)}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
      >
        <div className='modal__content__head border-bottom'>
          <h2 id={titleId} className={classNames(titleUtilities)}>{title}</h2>
          <ButtonIconOnly
            buttonType='button'
            iconHandle='close'
            ariaLabel={closeButtonLabel}
            utilities='font-size-md'
            onClick={onClose ?? undefined}
          />
        </div>

        <div className='modal__content__body flex-grow-1'>
          {children}
        </div>

        {footerContent && (
          <div className={classNames('modal__content__foot', 'border-top', footerUtilities)}>
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

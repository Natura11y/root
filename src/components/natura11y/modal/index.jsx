import { useEffect, useRef, useImperativeHandle, useId } from 'react';

import classNames from 'classnames';

import ButtonIconOnly from '../button/ButtonIconOnly';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';

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
    modalContentUtilities = null
}) => {

    const modalContainer = useRef(null);
    const modalContent = useRef(null);
    const titleId = useId();

    useImperativeHandle(ref, () => modalContainer.current);

    const modalClasses = classNames(
        'modal',
        {
            'modal--scroll-all': scrollAll,
            'shown': isOpen,
        },
        modalUtilities
    );

    const modalContentClasses = classNames(
        'modal__content',
        'border-radius-2',
        'box-shadow-3',
        {
        },
        modalContentUtilities
    );

    const handleKeyDown = (event) => {
        const focusableElements = getFocusableElements(modalContent.current);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.code === 'Tab') {
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        } else if (event.code === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            if (modalContainer.current) {
                handleOverlayOpen(modalContainer.current);
            }
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            if (modalContainer.current) {
                handleOverlayClose(modalContainer.current);
            }
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (modalContainer.current) {
                handleOverlayClose(modalContainer.current);
            }
        };
    }, [isOpen]);

    const handleCloseOutside = (event) => {
        if (closeOutside && modalContent.current && !modalContent.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <div
            ref={modalContainer}
            className={modalClasses}
            aria-hidden={!isOpen}
            onClick={handleCloseOutside}
        >
            <div
                ref={modalContent}
                className={modalContentClasses}
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
            >
                <header className='modal__content__head border-bottom'>
                    <h2 id={titleId}>
                        {title}
                    </h2>
                    <ButtonIconOnly
                        buttonType='button'
                        iconHandle='close'
                        utilities='font-size-md'
                        onClick={onClose}
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

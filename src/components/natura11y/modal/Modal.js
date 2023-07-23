import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

import { getFocusableElements } from '../../../utilities/focus';

import ButtonIconOnly from '../button/ButtonIconOnly';

const Modal = forwardRef((props, ref) => {

	const {
		scrollAll = false,
		closeOutside = false,
		title = 'Modal Title',
		isOpen = isOpen,
		handleModalClose = handleModalClose,
		children = <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

	} = props;

	const modalContainer = useRef(null);
	const modalContent = useRef(null);

	useImperativeHandle(ref, () => modalContainer.current);

  	let classScrolAll = scrollAll === true ? ' modal--scroll-all' : '';

	const handleKeyDown = (event) => {

		const focusableElements = getFocusableElements(modalContent.current);
		const firstElementOfModal = focusableElements[0];
		const lastElementOfModal = focusableElements[focusableElements.length - 1];

		switch (event.code) {
		
			case 'Tab':
				if (document.activeElement === lastElementOfModal) {
					if (!event.shiftKey) {
						event.preventDefault();
						firstElementOfModal.focus();
					}
				}

				if (document.activeElement === firstElementOfModal) {
					if (event.shiftKey) {
						event.preventDefault();
						lastElementOfModal.focus();
					}
				}

				if (document.activeElement === modalContent) {
					if (event.shiftKey) {
						event.preventDefault();
						firstElementOfModal.focus();
					}
				}

				break;

			case 'Escape':
				handleModalClose();
				break;
			
			default:
			// do nothing
		}

	};

  useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
		} else {
			document.removeEventListener('keydown', handleKeyDown);
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	const handleCloseOutside = (event) => {

		const modalContentClick = modalContent.current.contains(event.target);

		if (closeOutside && !modalContentClick) {
			handleModalClose();
		}
	};

	return (
		<div
			className={`modal ${classScrolAll} padding-4`}
			ref={modalContainer}
			id='modal-example-01'
			role='dialog'
			aria-hidden={isOpen ? false : true}
			tabIndex={isOpen ? 0 : -1}
			onClick={handleCloseOutside}
		>
			<div
				className='modal__content narrow border-radius box-shadow-3'
				aria-labelledby='modal-example-01-title'
				ref={modalContent}
			>
				<header className='modal__content__head border-bottom'>

					<h2 id='modal-example-01-title'>
						{title}
					</h2>

					<ButtonIconOnly
						buttonType='button'
						iconHandle='close'
						clickHandler={handleModalClose}
					/>
				
				</header>

				<main className='modal__content__body' id='modal-example-01-content'>
					{children}
				</main>

				<footer className='modal__content__foot border-top text-color-link'>
					<ul className='nav nav--horizontal justify-content-between'>
						<li>
							<a href='#1'>Secondary Action</a>
						</li>
						<li>
							<a className='button rounded-pill' href='#1'>
								Primary Action
							</a>
						</li>
					</ul>
				</footer>
			</div>
		</div>
	);
});

export default Modal;
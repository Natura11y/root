import { useRef, useId } from 'react';

import classNames from 'classnames';

import ButtonIconOnly from '../button/ButtonIconOnly';
import Icon from '../icon';

const Alert = ({
	ref,
	success = true,
	inverse = false,
	handleAlertClose = null,
	title = 'Alert Title',
	children = <p>Alert Description</p>,
	utilities = null,
}) => {

	const internalRef = useRef();
	const labelId = useId();
	const descId = useId();

	const isDismissable = handleAlertClose !== null;

	const alertClasses = classNames(
		'alert',
		{
			'alert--confirm' : success && !inverse,
			'alert--confirm--inverse' : success && inverse,
			'alert--warn' : !success && !inverse,
			'alert--warn--inverse' : !success && inverse,
		},
		utilities
	);

	const alertIconClasses = classNames(
		{
			'confirm' : success,
			'warn' : !success
		}
	);

	const handleClose = () => {
		const el = internalRef.current;
		if (!el) return;
		el.classList.add('dismissed');
		el.addEventListener('animationend', handleAlertClose, { once: true });
	};

	const setRef = (node) => {
		internalRef.current = node;
		if (typeof ref === 'function') {
			ref(node);
		} else if (ref) {
			ref.current = node;
		}
	};

	return (
		<div
			ref={setRef}
			className={alertClasses}
			aria-labelledby={labelId}
			aria-describedby={children ? descId : undefined}
			role='alert'
			{...(isDismissable && { 'aria-live': 'assertive', 'aria-atomic': 'true' })}
		>
			{isDismissable && (
				<ButtonIconOnly
					iconHandle='close'
					clickHandler={handleClose}
					ariaLabel='Close alert'
					attributes={{ 'data-alert-close': '' }}
				/>
			)}

			<div className='alert__title h5'>
				<Icon iconHandle={alertIconClasses} />
				<span className='alert__title__text' id={labelId}>
					{title}
				</span>
			</div>

			{children ? (
				<div className='alert__description' id={descId}>
					{children}
				</div>
			) : null}
		</div>
	);
};

export default Alert;

import { forwardRef } from 'react';

import classNames from 'classnames';

import Icon from '../icon';

const ButtonIconOverText = forwardRef((props, ref) => {

	const {
		iconHandle = 'home',
		iconUtilities = null,
		textUtilities = null,
		label = 'Home',
		tag = 'button',
		buttonType = 'button',
		linkUrl = '#1',
		outline = false,
		ariaLabel = null,
		clickHandler = null,
		ariaExpanded = null,
		utilities = null,
		attributes = {}, // Custom data attributes
	} = props;

	const buttonClasses = classNames('button', 'button--icon-over-text', {
		'button--outline': outline,
		[`${utilities}`]: utilities !== null,
	});

	const iconClasses = classNames('button__icon', {
		[`${iconUtilities}`]: iconUtilities !== null,
	});

	const textClasses = classNames('button__text', {
		[`${textUtilities}`]: textUtilities !== null,
	});

	const buttonContent = (
		<>
			<span className={iconClasses}>
				<Icon iconHandle={iconHandle} />
			</span>
			<span className={textClasses}>{label}</span>
		</>
	);

	const Component = {
		button: (
			<button
				ref={ref}
				type={buttonType}
				className={buttonClasses}
				onClick={clickHandler}
				aria-label={ariaLabel}
				aria-expanded={ariaExpanded}
				{...attributes}
			>
				{buttonContent}
			</button>
		),
		a: (
			<a
				ref={ref}
				className={buttonClasses}
				href={linkUrl}
				aria-label={ariaLabel}
				{...attributes}
			>
				{buttonContent}
			</a>
		),
	};

	return Component[tag] || Component.button;
});

export default ButtonIconOverText;
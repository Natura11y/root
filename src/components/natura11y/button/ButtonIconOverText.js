import { forwardRef } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon/Icon';

const ButtonIconOverText = forwardRef((props, ref) => {

	const {
		iconHandle = 'home',
		iconUtilities = null,
		textUtilities = null,
		label = 'Home',
		tag = 'button',
		buttonType = 'button',
		linkUrl = '#1',
		ariaLabel = null,
		clickHandler = null,
		ariaExpanded = null,
		utilities = null,
	} = props;

	const buttonClasses = classNames('button', 'button--icon-over-text', {
		[`${utilities}`]: utilities !== null,
	});

	const textClasses = classNames('text', {
		[`${textUtilities}`]: textUtilities !== null,
	});

	const buttonContent = (
		<>
			<Icon iconHandle={iconHandle} utilities={iconUtilities} />
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
			>
				{buttonContent}
			</button>
		),
		link: (
			<Link
				ref={ref}
				className={buttonClasses}
				to={linkUrl}
				aria-label={ariaLabel}
			>
				{buttonContent}
			</Link>
		),
		a: (
			<a
				ref={ref}
				className={buttonClasses}
				href={linkUrl}
				aria-label={ariaLabel}
			>
				{buttonContent}
			</a>
		),
	};

	return Component[tag] || Component.button;
});

export default ButtonIconOverText;
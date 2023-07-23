import { forwardRef } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon/Icon';

const ButtonIconOverText = forwardRef((props, ref) => {

	const {
		iconHandle = 'home', // Arbitrary default value
		iconUtilities = null,
		textUtilities = null,
		label = 'Home',
		tag = 'button',
		linkUrl = '#1',
		ariaLabel = null,
		clickHandler = null,
		ariaExpanded = null,
	} = props;

	const componentClasses = classNames('button', 'button--icon-over-text');

	const textClasses = classNames('button__text', {
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
				className={componentClasses}
				onClick={clickHandler}
				aria-label={ariaLabel}
				aria-expanded={ariaExpanded}
			>
				{buttonContent}
			</button>
		),
		link: (
			<Link
				className={componentClasses}
				to={linkUrl}
				aria-label={ariaLabel}
			>
				{buttonContent}
			</Link>
		),
		a: (
			<a
				className={componentClasses}
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
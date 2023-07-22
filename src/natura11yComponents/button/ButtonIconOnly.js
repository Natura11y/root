import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon/Icon';

const ButtonIconOnly = forwardRef((props, ref) => {
		
	const {
		tag = 'button',
		iconHandle = 'home',
		linkUrl = '#1',
		ariaLabel = null,
		clickHandler = null,
		ariaExpanded = null,
		utilities = null, // For example, 'theme-primary'
	} = props;

	const componentClasses = classNames('button', 'button--icon-only', {
		[utilities]: utilities !== null,
	});

	const Component = {
		button: (
			<button
				ref={ref}
				className={componentClasses}
				onClick={clickHandler}
				aria-label={ariaLabel}
				aria-expanded={ariaExpanded}
			>
				<Icon iconHandle={iconHandle} />
			</button>
		),
		link: (
			<Link
				className={componentClasses}
				to={linkUrl}
				aria-label={ariaLabel}
			>
				<Icon iconHandle={iconHandle} />
			</Link>
		),
		a: (
			<a
				className={componentClasses}
				href={linkUrl}
				aria-label={ariaLabel}
			>
				<Icon iconHandle={iconHandle} />
			</a>
		)
	};

	return Component[tag] || Component.button;
});

export default ButtonIconOnly;
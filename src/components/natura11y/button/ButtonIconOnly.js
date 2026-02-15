import { forwardRef } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon';

const ButtonIconOnly = forwardRef((props, ref) => {
		
	const {
		tag = 'button',
		buttonType = 'button',
		iconHandle = 'home',
		linkUrl = '#1',
		ariaLabel = null,
		clickHandler = null,
		ariaExpanded = null,
		utilities = null,
	} = props;

	const buttonClasses = classNames('button', 'button--icon-only', {
		[`${utilities}`]: utilities !== null,
	});

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
				<Icon iconHandle={iconHandle} />
			</button>
		),
		link: (
			<Link
				ref={ref}
				className={buttonClasses}
				to={linkUrl}
				aria-label={ariaLabel}
			>
				<Icon iconHandle={iconHandle} />
			</Link>
		),
		a: (
			<a
				ref={ref}
				className={buttonClasses}
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
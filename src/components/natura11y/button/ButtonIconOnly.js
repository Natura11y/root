import { forwardRef } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon/Icon';

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

	const componentClasses = classNames('button', 'button--icon-only', {
		[`${utilities}`]: utilities !== null,
	});

	const Component = {
		button: (
			<button
				ref={ref}
				type={buttonType}
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
				ref={ref}
				className={componentClasses}
				to={linkUrl}
				aria-label={ariaLabel}
			>
				<Icon iconHandle={iconHandle} />
			</Link>
		),
		a: (
			<a
				ref={ref}
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
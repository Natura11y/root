import classNames from 'classnames';

import Icon from '../icon';

const ButtonIconOnly = ({
	ref,
	tag = 'button',
	buttonType = 'button',
	iconHandle = 'home',
	linkUrl = '#1',
	outline = false,
	ariaLabel = null,
	clickHandler = null,
	ariaExpanded = null,
	utilities = null,
	attributes = {},
}) => {

	const buttonClasses = classNames('button', 'button--icon-only', {
		'button--outline': outline,
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
				{...attributes}
			>
				<Icon iconHandle={iconHandle} />
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
				<Icon iconHandle={iconHandle} />
			</a>
		)
	};

	return Component[tag] || Component.button;
};

export default ButtonIconOnly;

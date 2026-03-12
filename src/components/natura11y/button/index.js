import classNames from 'classnames';

import Icon from '../icon';

const Button = (props) => {

	const {
		tag = 'button',
		buttonType = 'button',
		title = 'Button',
		wrapText = true,
		linkUrl = '#1',
		outline = false,
		iconHandle = null, // Deprecated: use iconStartHandle or iconEndHandle
		iconStartHandle = null,
		iconEndHandle = null,
		utilities = null,
		attributes = {}, // Custom data attributes
		onClick = null,
		target = null,
		rel = null,
	} = props;

	// Backwards compatibility: if iconHandle is used, treat as iconStartHandle
	const startIcon = iconStartHandle || iconHandle;
	const endIcon = iconEndHandle;

	const buttonClasses = classNames(
		'button', {
		'button--outline': outline,
	}, utilities);

	const buttonContents = (
		<>
			{startIcon && <Icon iconHandle={startIcon} />}
			{wrapText ? <span className='text'>{title}</span> : title}
			{endIcon && <Icon iconHandle={endIcon} />}
		</>
	);

	const Component = {
		button: (
			<button
				type={buttonType}
				className={buttonClasses}
				onClick={onClick}
				{...attributes}
			>
				{buttonContents}
			</button>
		),
		a: (
			<a
				className={buttonClasses}
				href={linkUrl}
				target={target}
				rel={rel}
				{...attributes}
			>
				{buttonContents}
			</a>
		),
	};

	return Component[tag] || Component.button;
};

export default Button;
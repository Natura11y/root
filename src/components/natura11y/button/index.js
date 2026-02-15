import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon';

const Button = (props) => {

	const {
		tag = 'button',
		buttonType = 'button',
		title = 'Button',
		linkUrl = '#1',
		outline = false,
		iconHandle = null,
		utilities = null,
		clickHandler = null,
		target = null,
		rel = null,
	} = props;

	const buttonClasses = classNames('button', {
		'button--outline': outline,
		'button--has-icon': iconHandle !== null,
		[`${utilities}`]: utilities !== null,
	});

	const buttonContents = iconHandle !== null ? (
		<>
			<Icon iconHandle={iconHandle} />
			<span className='button__text'>{title}</span>
		</>
	) : (
		title
	);

	const Component = {
		button: (
			<button 
				type={buttonType}
				className={buttonClasses} 
				onClick={clickHandler}
			>
				{buttonContents}
			</button>
		),
		link: (
			<Link className={buttonClasses} to={linkUrl}>
				{buttonContents}
			</Link>
		),
		a: (
			<a
				className={buttonClasses}
				href={linkUrl}
				target={target}
				rel={rel}
			>
				{buttonContents}
			</a>
		),
	};

	return Component[tag] || Component.button;
};

export default Button;
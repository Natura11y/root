import React from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import Icon from '../icon/Icon';

const Button = (props) => {

	const {
		tag = 'button',
		title = 'Button',
		linkUrl = '#1',
		outline = false,
		iconHandle = null,
		utilities = null,
		clickHandler = null,
	} = props;

	const componentClasses = classNames('button', {
		'button--outline': outline,
		'button--has-icon': iconHandle !== null,
		[`${utilities}`]: utilities !== null, // For example, 'theme-primary'
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
			<button className={componentClasses} onClick={clickHandler}>
				{buttonContents}
			</button>
		),
		link: (
			<Link className={componentClasses} to={linkUrl}>
				{buttonContents}
			</Link>
		),
		a: (
			<a className={componentClasses} href={linkUrl}>
				{buttonContents}
			</a>
		),
	};

	return Component[tag] || Component.link;
};

export default Button;
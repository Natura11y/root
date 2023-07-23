import React from 'react';

import classNames from 'classnames';

const Backdrop = ( props ) => {

    const { 
		title = 'Backdrop Title',
		fixedHeight = null,
		stack = null,
		imageOpacity = '30',
		imageURL = 'https://via.placeholder.com/1500x750',
		imageAlt = 'Placeholder',
		children = (
			<div className='container medium margin-y-4'>
				<h1>
					{title}
				</h1>
			</div>
		),
		utilities = null
	} = props;

	const backdropClasses = classNames(
		'backdrop',
		{ 
			'backdrop--fixed' : fixedHeight !== null || utilities?.includes(`aspect-ratio`),
			[`backdrop--stack--${stack}`] : stack !== null && fixedHeight === null,
			[`${utilities}`] : utilities !== null
		}
	);
	
	const imageOpacityModifier = classNames({
		[`--${stack}`] : stack !== null && fixedHeight === null
	});

	const backdropStyle = {'--backdrop-fixed-height': fixedHeight !== null ? `${fixedHeight}` : null };

	return (
		<div
			className={`${backdropClasses}`}
			style={backdropStyle}
		>

			<div className='backdrop__image'>
				<img
					className={`opacity-${imageOpacity}${imageOpacityModifier}`}
					src={imageURL}
					alt={imageAlt}
				/>
			</div>

			<div className='backdrop__cover'>
				{children}
			</div>
		
		</div>
	);
}

export default Backdrop;
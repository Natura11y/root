import React, { useEffect } from 'react';

import classNames from 'classnames';

const LightboxButton = (props) => {

	const {
		lbType,
		lbSrc,
		lbCaption,
		onClick,
		onMount,
		utilities = null,
		children = 'Lightbox Button',
	} = props;

	useEffect(() => {
		onMount({ lbType, lbSrc, lbCaption });
	}, []);

	const componentClasses = classNames({
		[`${utilities}`]: utilities !== null,
	});

	return (
		<button
			className={componentClasses}
			onClick={() => onClick( lbType, lbSrc, lbCaption)}
		>
			{children}
		</button>
	);
};

export default LightboxButton;
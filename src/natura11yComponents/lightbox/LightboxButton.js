import React, { useEffect } from 'react';

import classNames from 'classnames';

const LightboxButton = (props) => {

	const {
		type,
		src,
		caption,
		onClick,
		onMount,
		utilities = null,
		children = 'Lightbox Button',
	} = props;

	useEffect(() => {
		onMount({ type, src, caption });
	}, []);

	const componentClasses = classNames({
		[`${utilities}`]: utilities !== null,
	});

	return (
		<button
			className={componentClasses}
			onClick={() => onClick(src, caption, type)}
		>
			{children}
		</button>
	);
};

export default LightboxButton;

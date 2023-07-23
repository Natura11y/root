import React from 'react';

import Icon from '../icon/Icon';

const RequiredIndicator = ({text = 'Required fields indicated with'}) => {
	return (
		<p className='required-indicator' aria-hidden='true'>
			<span className='required-indicator__text'>
				{text}
			</span>
            <Icon iconHandle='asterisk' />
		</p>
	);
};

export default RequiredIndicator;
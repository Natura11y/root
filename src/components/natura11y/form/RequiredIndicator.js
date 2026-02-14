import { forwardRef } from 'react';

import Icon from '../icon/Icon';

const RequiredIndicator = forwardRef(({text = 'Required fields indicated with'}, ref) => {
	return (
		<p ref={ref} className='required-indicator' aria-hidden='true'>
			<span className='required-indicator__text'>
				{text}
			</span>
            <Icon iconHandle='asterisk' />
		</p>
	);
});

export default RequiredIndicator;
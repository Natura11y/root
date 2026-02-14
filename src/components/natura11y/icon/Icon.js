import { forwardRef } from 'react';

import classNames from 'classnames';

const Icon = forwardRef((props, ref) => {

    const {
        iconHandle = 'home', 
        utilities = null
    } = props;

    const iconClasses = classNames(
        'icon',
        [`icon-${iconHandle}`],
        {
            [`${utilities}`] : utilities !== null
        }
    );

	return (
        <span
            ref={ref}
            className={iconClasses} 
            aria-hidden='true'>
        </span>
    );
});

export default Icon;
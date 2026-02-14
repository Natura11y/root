import { forwardRef } from 'react';

import classNames from 'classnames';

const Icon = forwardRef((props, ref) => {

    const {
        iconHandle = 'home', 
        utilities = null
    } = props;

    const componentClasses = classNames(
        'icon',
        [`icon-${iconHandle}`],
        {
            [`${utilities}`] : utilities !== null
        }
    );

	return (
        <span
            ref={ref}
            className={componentClasses} 
            aria-hidden='true'>
        </span>
    );
});

Icon.displayName = 'Icon';

export default Icon;
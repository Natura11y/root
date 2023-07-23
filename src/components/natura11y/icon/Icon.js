import React from 'react';

import classNames from 'classnames';

const Icon = (props) => {

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
            className={componentClasses} 
            aria-hidden='true'>
        </span>
    );
};

export default Icon;
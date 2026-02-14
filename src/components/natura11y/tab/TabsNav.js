import { forwardRef } from 'react';

import classNames from 'classnames';

const TabsNav = forwardRef(( props, ref ) => {

    const { 
        data,
        breakpoint = 'md',
        pill = false,
        activeTab,
        handleClick = handleClick,
        handleKeyDown = handleKeyDown,
        tabButtonRefs
    } = props;

	const tabButtons = data.map((button, index) => (

		<li key={index}>        
            <button
                ref={el => tabButtonRefs.current[index] = el}
                className={activeTab === button.title ? 'is-active' : ''}
                id={`tab-button-example-${index}`}
                aria-controls={`tab-panel-example-${index}`}
                aria-selected={activeTab === button.title ? true : false}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                data-title={button.title}
                data-index={index}
                role='tab'
            >
                {button.title}
            </button>
        </li>
        
	));

    const navClasses = classNames(
        'tabs-nav',
        `tabs-nav--horizontal--${breakpoint}`,
        {
            'tabs-nav--pill': pill
        }
    );

	return (
		<ul ref={ref} className={navClasses}>
			{tabButtons}
		</ul>
	);
});

export default TabsNav;
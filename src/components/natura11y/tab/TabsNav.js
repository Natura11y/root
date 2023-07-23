const TabsNav = ( props ) => {

    const { 
        data,
        breakpoint = 'md',
        activeTab,
        handleClick = handleClick,
        handleKeyDown = handleKeyDown
    } = props;

	const tabButtons = data.map((button, index) => (

		<li key={index}>        
            <button
                className='tab__button' 
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

	return (
		<ul className='tabs-nav tabs-nav--horizontal'>
			{tabButtons}
		</ul>
	);
};

export default TabsNav;
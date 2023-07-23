const TabPanel = ( props ) => {
    const {
        isActive = false,
        children = <p>Tab panel content.</p>
    } = props;

	return (
		<div
			className={`tabs__panel ${isActive ? 'shown' : ''}`}
			id='tab-panel-example-01'
			aria-labelledby='tab-button-example-01'
			role='tabpanel'
		>
			<div className='container padding-y-4'>
				{children}
			</div>
		</div>
	);
};

export default TabPanel;
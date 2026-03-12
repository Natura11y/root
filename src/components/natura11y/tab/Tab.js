import { useContext } from 'react';

import { TabContext } from './TabContext';

const Tab = ({ title, children }) => {

	const { activeTab } = useContext(TabContext);
	const isActive = activeTab === title;
	const id = title.toLowerCase().replace(/\s+/g, '-');

	return (
		<div
			className={`tabs__panel${isActive ? ' shown' : ''}`}
			id={`tab-panel-${id}`}
			aria-labelledby={`tab-button-${id}`}
			role='tabpanel'
			inert={!isActive ? true : undefined}
		>
			<div className='container padding-y-4'>
				{children}
			</div>
		</div>
	);

};

export default Tab;

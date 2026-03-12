import { useState, useRef, useCallback } from 'react';
import React from 'react';
import classNames from 'classnames';

import { TabContext } from './TabContext';
import Tab from './Tab';

const Tabs = ({ children, pill = false, breakpoint = 'md', navClass = null }) => {

	const childArray = React.Children.toArray(children);
	const [activeTab, setActiveTab] = useState(childArray[0]?.props.title ?? null);
	const tabsRef = useRef(null);

	const handleKeyDown = useCallback((e) => {
		if (!tabsRef.current) return;

		const buttons = Array.from(tabsRef.current.querySelectorAll('[role="tab"]'));
		const index = buttons.indexOf(e.target);

		if (index === -1) return;

		const navigate = (dir) => {
			e.preventDefault();
			let next = index + dir;
			if (next < 0) next = buttons.length - 1;
			if (next >= buttons.length) next = 0;
			buttons[next].focus();
		};

		switch (e.code) {
			case 'Home':
				e.preventDefault();
				buttons[0].focus();
				break;
			case 'End':
				e.preventDefault();
				buttons[buttons.length - 1].focus();
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				navigate(-1);
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				navigate(1);
				break;
			default:
				// do nothing
		}
	}, []);

	const titleToId = (title) => title.toLowerCase().replace(/\s+/g, '-');

	const navClasses = navClass ?? classNames(
		'tabs-nav',
		`tabs-nav--horizontal--${breakpoint}`,
		{ 'tabs-nav--pill': pill }
	);

	return (
		<TabContext.Provider value={{ activeTab }}>
			<div ref={tabsRef} className='tabs' role='tablist'>

				<ul className={navClasses}>
					{childArray.map((child) => {
						const title = child.props.title;
						const id = titleToId(title);
						const isActive = activeTab === title;
						return (
							<li key={title}>
								<button
									className={isActive ? 'is-active' : ''}
									id={`tab-button-${id}`}
									aria-controls={`tab-panel-${id}`}
									aria-selected={isActive}
									onClick={() => setActiveTab(title)}
									onKeyDown={handleKeyDown}
									role='tab'
								>
									{title}
								</button>
							</li>
						);
					})}
				</ul>

				{children}

			</div>
		</TabContext.Provider>
	);

};

Tabs.Tab = Tab;

export default Tabs;

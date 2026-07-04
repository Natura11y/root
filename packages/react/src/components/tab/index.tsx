import React, { useRef, useId, type ReactNode } from 'react';
import classNames from 'classnames';
import { TabContext } from './TabContext';
import { useControlled } from '../../hooks/useControlled';
import { useLinearKeyNav } from '../../hooks/useLinearKeyNav';
import Tab from './Tab';

interface TabsProps {
  defaultActiveTab?: string | null;
  activeTab?: string | null;
  onTabChange?: (title: string) => void;
  pill?: boolean;
  breakpoint?: string;
  navClass?: string | null;
  children: ReactNode;
}

const Tabs = ({
  defaultActiveTab,
  activeTab,
  onTabChange,
  pill = false,
  breakpoint = 'md',
  navClass = null,
  children,
}: TabsProps) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();

  const childArray = React.Children.toArray(children) as React.ReactElement<{ title: string }>[];
  const firstTitle = childArray[0]?.props.title ?? null;

  const [activeTabState, setActiveTabState] = useControlled({
    controlled: activeTab,
    default: defaultActiveTab ?? firstTitle,
    name: 'Tabs',
    state: 'activeTab',
  });

  const handleTabClick = (title: string) => {
    setActiveTabState(title);
    onTabChange?.(title);
  };

  const { onKeyDown } = useLinearKeyNav({
    containerRef: tabsRef,
    itemSelector: '[role="tab"]',
    orientation: 'horizontal',
  });

  const navClasses = navClass ?? classNames(
    'tabs-nav',
    `tabs-nav--horizontal--${breakpoint}`,
    { 'tabs-nav--pill': pill }
  );

  return (
    <TabContext.Provider value={{ activeTab: activeTabState, idPrefix, setActiveTab: handleTabClick, onTabChange }}>
      <div ref={tabsRef} className='tabs' role='tablist' onKeyDown={onKeyDown}>
        <ul className={navClasses}>
          {childArray.map((child) => {
            const title = child.props.title;
            const slug = title.toLowerCase().replace(/\s+/g, '-');
            const isActive = activeTabState === title;
            return (
              <li key={title}>
                <button
                  className={isActive ? 'is-active' : ''}
                  id={`${idPrefix}-btn-${slug}`}
                  aria-controls={`${idPrefix}-panel-${slug}`}
                  aria-selected={isActive}
                  onClick={() => handleTabClick(title)}
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
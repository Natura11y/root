import { type ReactNode } from 'react';
import { useTabContext } from './TabContext';

export interface TabProps {
  title: string;
  children?: ReactNode;
}

const Tab = ({ title, children }: TabProps) => {
  const { activeTab, idPrefix } = useTabContext();
  const isActive = activeTab === title;
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className={`tabs__panel${isActive ? ' shown' : ''}`}
      id={`${idPrefix}-panel-${slug}`}
      data-state={isActive ? 'active' : 'inactive'}
      aria-labelledby={`${idPrefix}-btn-${slug}`}
      aria-hidden={!isActive}
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
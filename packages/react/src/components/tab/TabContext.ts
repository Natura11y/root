import { createContext, useContext } from 'react';

interface TabContextValue {
  activeTab: string | null;
  idPrefix: string;
  setActiveTab: (title: string) => void;
  onTabChange?: (title: string) => void;
}

export const TabContext = createContext<TabContextValue | null>(null);

export function useTabContext(): TabContextValue {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('TabPanel must be used inside a Tabs component');
  }
  return context;
}
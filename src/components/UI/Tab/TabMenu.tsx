import React from 'react';
import { TabMenuContainer } from './Tab.styles';
import { Tab } from './Tab';
import type { TabMenuProps } from './Tab.types';

/**
 * TabMenu Component
 *
 * A container component that manages multiple tabs.
 * Handles tab selection and provides a consistent navigation interface.
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
 *   { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
 *   { id: 'workers', label: 'Workers', icon: <WorkersIcon /> },
 * ];
 *
 * const [activeTab, setActiveTab] = useState('dashboard');
 *
 * <TabMenu
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 *   size="medium"
 * />
 * ```
 */
export const TabMenu: React.FC<TabMenuProps> = ({
  tabs,
  activeTab,
  onChange,
  size = 'medium',
  className,
  sx,
}) => {
  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab) {
      onChange(tabId);
    }
  };

  return (
    <TabMenuContainer className={className} sx={sx} role="tablist">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          active={tab.id === activeTab}
          disabled={tab.disabled}
          size={size}
          onClick={() => handleTabClick(tab.id)}
        />
      ))}
    </TabMenuContainer>
  );
};

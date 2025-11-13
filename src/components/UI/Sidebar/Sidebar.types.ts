import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

/**
 * Represents a single sidebar navigation item
 */
export interface SidebarItem {
  /**
   * Unique identifier for the sidebar item
   */
  id: string;

  /**
   * Display label for the item
   */
  label: string;

  /**
   * Optional icon component (ReactNode)
   */
  icon?: ReactNode;

  /**
   * Callback when item is clicked
   */
  onClick?: () => void;
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  /**
   * Array of sidebar navigation items
   */
  items: SidebarItem[];

  /**
   * Currently active item id
   */
  activeItemId?: string;

  /**
   * Callback when item is clicked
   */
  onItemClick?: (itemId: string) => void;

  /**
   * Whether the sidebar is collapsed
   */
  isCollapsed?: boolean;

  /**
   * Callback when collapse/expand toggle is clicked
   */
  onToggleCollapse?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}

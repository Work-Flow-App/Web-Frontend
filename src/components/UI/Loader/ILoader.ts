/**
 * Loader component props interface
 */
export interface ILoader {
  /**
   * Size of the circular progress indicator in pixels
   * @default 40
   */
  size?: number;

  /**
   * Whether to center the loader
   * @default true
   */
  centered?: boolean;

  /**
   * Whether to display as full screen loader
   * @default false
   */
  fullScreen?: boolean;

  /**
   * Minimum height for centered loader
   * @default "200px"
   */
  minHeight?: string;

  /**
   * Optional message to display below the loader
   */
  message?: string;

  /**
   * Color of the circular progress
   * @default "primary"
   */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

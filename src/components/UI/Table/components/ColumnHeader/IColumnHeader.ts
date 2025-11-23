export interface IColumnHeader {
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Enable column-level search */
  showColumnSearch?: boolean;
  /** Enable actions column */
  showActions?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Enable sticky left columns (for checkboxes and first column) */
  enableStickyLeft?: boolean;
  /** Enable sticky right columns (for actions) */
  enableStickyRight?: boolean;
}

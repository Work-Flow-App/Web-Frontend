export interface IColumnHeader {
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Enable column-level search */
  showColumnSearch?: boolean;
  /** Enable actions column */
  showActions?: boolean;
  /** Custom className for styling */
  className?: string;
}

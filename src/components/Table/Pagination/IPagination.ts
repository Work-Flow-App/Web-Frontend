export interface IPagination {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show (default: 5) */
  maxPageButtons?: number;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface IStyledPaginationButtonProps {
  active?: boolean;
  disabled?: boolean;
}

import React, { useMemo } from 'react';
import type { IPagination } from './IPagination';
import { Button } from '../../Button';
import {
  PaginationContainer,
  EllipsisContainer,
} from './Pagination.styles';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';

/**
 * Pagination component for navigating through pages of data
 *
 * @component
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log('Page:', page)}
 * />
 * ```
 */
const Pagination: React.FC<IPagination> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
  showPrevNext = true,
  showFirstLast = false,
  className,
  disabled = false,
}) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle range
      let start = Math.max(2, currentPage - Math.floor((maxPageButtons - 2) / 2));
      let end = Math.min(totalPages - 1, start + maxPageButtons - 3);

      // Adjust start if we're near the end
      if (end === totalPages - 1) {
        start = Math.max(2, end - (maxPageButtons - 3));
      }

      // Add ellipsis before middle range if needed
      if (start > 2) {
        pages.push('ellipsis');
      }

      // Add middle range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle range if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) {
      return;
    }
    onPageChange(page);
  };

  const handlePrevious = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationContainer className={className}>
      {showPrevNext && (
        <Button
          variant="text"
          size="small"
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          startIcon={<ChevronLeftIcon />}
        >
          Previous
        </Button>
      )}

      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <EllipsisContainer key={`ellipsis-${index}`}>
              ...
            </EllipsisContainer>
          );
        }

        return (
          <Button
            key={page}
            variant="text"
            size="small"
            disabled={disabled}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        );
      })}

      {showPrevNext && (
        <Button
          variant="text"
          size="small"
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          endIcon={<ChevronRightIcon />}
        >
          Next
        </Button>
      )}
    </PaginationContainer>
  );
};

export default Pagination;

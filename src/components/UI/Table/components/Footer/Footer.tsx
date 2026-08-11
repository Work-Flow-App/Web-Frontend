import React from 'react';
import type { IFooter } from './IFooter';
import { usePagination } from '../../context';
import Pagination from '../../Pagination/Pagination';
import { FooterContainer } from './Footer.styles';

/**
 * Footer component for table pagination
 *
 * @component
 * @example
 * ```tsx
 * <Footer
 *   showPagination
 *   maxPageButtons={5}
 *   showPrevNext
 * />
 * ```
 */
const Footer: React.FC<IFooter> = ({
  showPagination = true,
  maxPageButtons = 5,
  showPrevNext = true,
  showFirstLast = false,
  className,
}) => {
  const { currentPage, totalPages, goToPage } = usePagination();

  if (!showPagination || totalPages <= 1) {
    return null;
  }

  return (
    <FooterContainer className={className}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        maxPageButtons={maxPageButtons}
        showPrevNext={showPrevNext}
        showFirstLast={showFirstLast}
      />
    </FooterContainer>
  );
};

export default Footer;

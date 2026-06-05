import { memo, useCallback } from 'react';
import { Button } from '../Button';
import { Search } from '../Search';
import { StandaloneDropdown } from '../Forms/Dropdown';
import type { PageWrapperProps } from './PageWrapper.types';
import * as S from './PageWrapper.styles';
import FilterIcon from './Icons/FilterIcon.tsx';



const PageWrapperContent = memo(
  ({
    title,
    description,
    children,
    actions = [],
    dropdownOptions,
    dropdownValue,
    dropdownPlaceholder = 'All Member',
    onDropdownChange,
    showSearch = false,
    searchPlaceholder = 'Search',
    onSearchChange,
    onSearch,
    showFilter = false,
    onFilterClick,
    headerExtra,
    maxWidth,
  }: PageWrapperProps) => {
    const handleDropdownChange = useCallback((value: string | number | null) => {
      if (value !== null) {
        onDropdownChange?.(value);
      }
    }, [onDropdownChange]);

    return (
      <S.PageContainer maxWidth={maxWidth}>
          <S.PageHeader>
            <S.HeaderContent>
              <S.HeaderLeft>
                <S.Title>{title}</S.Title>
                {description && <S.Description>{description}</S.Description>}
              </S.HeaderLeft>

              <S.HeaderRight>
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={action.onClick}
                    variant={action.variant || 'contained'}
                    color={action.color || 'primary'}
                    disabled={action.disabled}
                    startIcon={action.icon}
                  >
                    {action.label}
                  </Button>
                ))}

                {headerExtra}

                {dropdownOptions && dropdownOptions.length > 0 && (
                  <S.DropdownWrapper>
                    <StandaloneDropdown
                      name="pageDropdown"
                      placeHolder={dropdownPlaceholder}
                      preFetchedOptions={dropdownOptions}
                      defaultValue={dropdownValue || ''}
                      onChange={handleDropdownChange}
                      hideErrorMessage
                      size="medium"
                    />
                  </S.DropdownWrapper>
                )}

                {showSearch && (
                  <Search
                    placeholder={searchPlaceholder}
                    onChange={onSearchChange}
                    onSearch={onSearch}
                  />
                )}

                {showFilter && onFilterClick && (
                  <S.FilterButton onClick={onFilterClick}>
                    <FilterIcon />
                  </S.FilterButton>
                )}
              </S.HeaderRight>
            </S.HeaderContent>
          </S.PageHeader>

          <S.PageContent>{children}</S.PageContent>
        </S.PageContainer>
    );
  }
);

PageWrapperContent.displayName = 'PageWrapperContent';

export const PageWrapper = memo((props: PageWrapperProps) => {
  return <PageWrapperContent {...props} />;
});

PageWrapper.displayName = 'PageWrapper';

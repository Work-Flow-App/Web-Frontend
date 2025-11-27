import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { Button } from '../Button';
import { Search } from '../Search';
import { Dropdown } from '../Forms/Dropdown';
import type { PageWrapperProps } from './PageWrapper.types';
import * as S from './PageWrapper.styles';

const FilterIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="47" height="47" rx="5.5" stroke="#F5F5F5" />
    <path
      d="M17.4004 14.0996H30.6004C31.7004 14.0996 32.6004 14.9996 32.6004 16.0996V18.2996C32.6004 19.0996 32.1004 20.0996 31.6004 20.5996L27.3004 24.3996C26.7004 24.8996 26.3004 25.8996 26.3004 26.6996V30.9996C26.3004 31.5996 25.9004 32.3996 25.4004 32.6996L24.0004 33.5996C22.7004 34.3996 20.9004 33.4996 20.9004 31.8996V26.5996C20.9004 25.8996 20.5004 24.9996 20.1004 24.4996L16.3004 20.4996C15.8004 19.9996 15.4004 19.0996 15.4004 18.4996V16.1996C15.4004 14.9996 16.3004 14.0996 17.4004 14.0996Z"
      stroke="#D4D4D4"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
    const methods = useForm({
      defaultValues: {
        pageDropdown: dropdownValue || '',
      },
    });

    const handleDropdownChange = (value: string | number) => {
      onDropdownChange?.(value);
    };

    return (
      <FormProvider {...methods}>
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
                  <Box sx={{ minWidth: 'auto', maxWidth: 'fit-content' }}>
                    <Dropdown
                      name="pageDropdown"
                      placeHolder={dropdownPlaceholder}
                      preFetchedOptions={dropdownOptions}
                      onChange={handleDropdownChange}
                      hideErrorMessage
                    />
                  </Box>
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
      </FormProvider>
    );
  }
);

PageWrapperContent.displayName = 'PageWrapperContent';

export const PageWrapper = memo((props: PageWrapperProps) => {
  return <PageWrapperContent {...props} />;
});

PageWrapper.displayName = 'PageWrapper';

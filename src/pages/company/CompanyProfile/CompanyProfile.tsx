import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';
import { Button } from '../../../components/UI/Button';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import type { PageAction } from '../../../components/UI/PageWrapper';
import { companyService } from '../../../services/api';
import type { CompanyProfileResponse } from '../../../services/api';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { CompanyProfileResponseCurrencyEnum } from '../../../../workflow-api';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useFetch } from '../../../hooks/useFetch';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { CompanyProfileFormSchema } from './CompanyProfileSchema';
import type { CompanyProfileField } from './CompanyProfileSchema';
import {
  SectionsGrid,
  SectionCard,
  SectionTitle,
  FieldsGrid,
  LoadingContainer,
  TabsWrapper,
  StyledTabs,
  StyledTab,
  TabContent,
  EmptySectionState,
  EmptySectionText,
} from './CompanyProfile.styles';
import type { CompanyProfileFormData } from './ICompanyProfile';
import { BillingSettings } from '../../settings/BillingSettings';
import { LogoUpload, CompanySnapshot, DocumentsTab, PostsTab, SchemaField } from './components';

const TABS = ['overview', 'documents', 'posts', 'billing'] as const;

type SchemaEntry = [keyof CompanyProfileFormData, CompanyProfileField];

const SCHEMA_ENTRIES = Object.entries(CompanyProfileFormSchema) as SchemaEntry[];
const COMPANY_GRID_FIELDS = SCHEMA_ENTRIES.filter(
  ([key, field]) => field.section === 'company' && key !== 'name' && key !== 'description'
);
const ADDRESS_FIELDS = SCHEMA_ENTRIES.filter(([, field]) => field.section === 'address');
const BANK_FIELDS = SCHEMA_ENTRIES.filter(([, field]) => field.section === 'bank');

export const CompanyProfile: React.FC = () => {
  const { refreshCurrency } = useCurrency();
  const { showSuccess, showError } = useSnackbar();
  const { canEdit } = useCompanyRole();
  const { fieldRules, defaultValues } = useSchema(CompanyProfileFormSchema);

  const methods = useForm<CompanyProfileFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const buildFormValues = (data: CompanyProfileResponse) => ({
    name: data.name || '',
    description: data.description || '',
    website: data.website || '',
    tagline: data.tagline || '',
    email: data.email || '',
    contactEmail: data.contactEmail || '',
    contactNumber: data.contactNumber || '',
    telephone: data.telephone || '',
    mobile: data.mobile || '',
    fax: data.fax || '',
    addressLine1: data.address?.addressLine1 || '',
    addressLine2: data.address?.addressLine2 || '',
    addressLine3: data.address?.addressLine3 || '',
    town: data.address?.town || '',
    country: data.address?.country || '',
    postcode: data.address?.postcode || '',
    vatNumber: data.vatNumber || '',
    currency: data.currency || '',
    bankName: data.bankDetails?.bankName || '',
    accountName: data.bankDetails?.accountName || '',
    accountNo: data.bankDetails?.accountNo || '',
    sortCode: data.bankDetails?.sortCode || '',
  });

  const fetchProfile = useCallback(() => companyService.getProfile(), []);
  const {
    data: profile,
    loading: isLoading,
    refetch: refetchProfile,
  } = useFetch<CompanyProfileResponse>(fetchProfile, [], {
    onError: (error) => showError(extractErrorMessage(error, 'Failed to load company profile.')),
  });

  useEffect(() => {
    if (profile) reset(buildFormValues(profile));
  }, [profile, reset]);

  // Schema-shaped view of the profile, reusing buildFormValues so read-only display and the
  // editable form always derive from the same field-by-field mapping.
  const profileValues = profile ? buildFormValues(profile) : null;
  const hasAddressData = ADDRESS_FIELDS.some(([key]) => Boolean(profileValues?.[key]));
  const hasBankData = BANK_FIELDS.some(([key]) => Boolean(profileValues?.[key]));

  const { saving: isSaving, withSaving } = useFormSubmit();

  const onSubmit = (data: CompanyProfileFormData) =>
    withSaving(async () => {
      try {
        await companyService.updateProfile({
          name: data.name,
          description: data.description || undefined,
          website: data.website || undefined,
          tagline: data.tagline || undefined,
          email: data.email || undefined,
          contactEmail: data.contactEmail || undefined,
          contactNumber: data.contactNumber || undefined,
          telephone: data.telephone || undefined,
          mobile: data.mobile || undefined,
          fax: data.fax || undefined,
          address: {
            addressLine1: data.addressLine1 || undefined,
            addressLine2: data.addressLine2 || undefined,
            addressLine3: data.addressLine3 || undefined,
            town: data.town || undefined,
            country: data.country || undefined,
            postcode: data.postcode || undefined,
          },
          vatNumber: data.vatNumber || undefined,
          currency: ((typeof data.currency === 'object' ? (data.currency as {value: string})?.value : data.currency) as CompanyProfileResponseCurrencyEnum) || undefined,
          bankDetails: {
            bankName: data.bankName || undefined,
            accountName: data.accountName || undefined,
            accountNo: data.accountNo || undefined,
            sortCode: data.sortCode || undefined,
          },
        });
        refetchProfile();
        refreshCurrency();
        setIsEditing(false);
        showSuccess('Profile updated successfully.');
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to update profile. Please try again.'));
      }
    });

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profile) reset(buildFormValues(profile));
    setIsEditing(false);
  };

  const handleLogoChange = () => refetchProfile();

  const pageActions: PageAction[] = useMemo(() => {
    if (activeTab !== TABS.indexOf('overview') || !canEdit) return [];
    if (isEditing) {
      return [
        { label: 'Cancel', variant: 'outlined', color: 'secondary', onClick: handleCancel, disabled: isSaving },
        {
          label: isSaving ? 'Saving...' : 'Save Changes',
          variant: 'contained',
          color: 'primary',
          onClick: handleSubmit(onSubmit),
          disabled: isSaving,
        },
      ];
    }
    return [{ label: 'Edit Profile', variant: 'contained', color: 'primary', onClick: handleEdit }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, canEdit, isEditing, isSaving, profile]);

  if (isLoading) {
    return (
      <PageWrapper title="Company Profile">
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      </PageWrapper>
    );
  }

  return (
    <FormProvider {...methods}>
      <PageWrapper title="Company Profile" actions={pageActions}>
        <TabsWrapper>
          <StyledTabs value={activeTab} onChange={(_: SyntheticEvent, val: number) => setActiveTab(val)}>
            <StyledTab label="Overview" />
            <StyledTab label="Documents" />
            <StyledTab label="Posts" />
            <StyledTab label="Billing" />
          </StyledTabs>
        </TabsWrapper>

        {activeTab === TABS.indexOf('documents') && (
          <TabContent>
            <DocumentsTab />
          </TabContent>
        )}

        {activeTab === TABS.indexOf('posts') && (
          <TabContent>
            <PostsTab />
          </TabContent>
        )}

        {activeTab === TABS.indexOf('billing') && (
          <TabContent>
            <BillingSettings />
          </TabContent>
        )}

        {activeTab === TABS.indexOf('overview') && (
          <>
            <TabContent>
              <CompanySnapshot />
            </TabContent>

            <SectionsGrid>
              {/* Company Information */}
              <SectionCard>
                <SectionTitle>Company Information</SectionTitle>

                <LogoUpload
                  logoUrl={profile?.logoUrl}
                  companyName={profile?.name}
                  editable={canEdit}
                  onLogoChange={handleLogoChange}
                />

                <SchemaField
                  isEditing={isEditing}
                  name="name"
                  field={CompanyProfileFormSchema.name}
                  error={errors.name}
                  viewValue={profileValues?.name}
                />
                <SchemaField
                  isEditing={isEditing}
                  name="description"
                  field={CompanyProfileFormSchema.description}
                  viewValue={profileValues?.description}
                />
                <FieldsGrid>
                  {COMPANY_GRID_FIELDS.map(([key, field]) => (
                    <SchemaField
                      key={key}
                      isEditing={isEditing}
                      name={key}
                      field={field}
                      error={errors[key] as FieldError | undefined}
                      viewValue={profileValues?.[key]}
                    />
                  ))}
                </FieldsGrid>
              </SectionCard>

              {/* Address */}
              <SectionCard>
                <SectionTitle>Address</SectionTitle>
                {isEditing || hasAddressData ? (
                  <FieldsGrid>
                    {ADDRESS_FIELDS.map(([key, field]) => (
                      <SchemaField
                        key={key}
                        isEditing={isEditing}
                        name={key}
                        field={field}
                        error={errors[key] as FieldError | undefined}
                        viewValue={profileValues?.[key]}
                      />
                    ))}
                  </FieldsGrid>
                ) : (
                  <EmptySectionState>
                    <EmptySectionText>No address on file yet.</EmptySectionText>
                    {canEdit && (
                      <Button variant="text" color="primary" size="small" onClick={handleEdit}>
                        Add Address
                      </Button>
                    )}
                  </EmptySectionState>
                )}
              </SectionCard>

              {/* Bank Details */}
              <SectionCard>
                <SectionTitle>Bank Details</SectionTitle>
                {isEditing || hasBankData ? (
                  <FieldsGrid>
                    {BANK_FIELDS.map(([key, field]) => (
                      <SchemaField
                        key={key}
                        isEditing={isEditing}
                        name={key}
                        field={field}
                        error={errors[key] as FieldError | undefined}
                        viewValue={profileValues?.[key]}
                      />
                    ))}
                  </FieldsGrid>
                ) : (
                  <EmptySectionState>
                    <EmptySectionText>No bank details on file yet.</EmptySectionText>
                    {canEdit && (
                      <Button variant="text" color="primary" size="small" onClick={handleEdit}>
                        Add Bank Details
                      </Button>
                    )}
                  </EmptySectionState>
                )}
              </SectionCard>
            </SectionsGrid>
          </>
        )}
      </PageWrapper>
    </FormProvider>
  );
};

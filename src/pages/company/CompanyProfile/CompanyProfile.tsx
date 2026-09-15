import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import CheckIcon from '@mui/icons-material/Check';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { Button } from '../../../components/UI/Button';
import { companyService } from '../../../services/api';
import type { CompanyProfileResponse } from '../../../services/api';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { CompanyProfileResponseCurrencyEnum } from '../../../../workflow-api';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { copyToClipboard } from '../../../utils/clipboard';
import { slugify } from '../../../utils/slugify';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useFetch } from '../../../hooks/useFetch';
import { useFormSubmit } from '../../../hooks/useFormSubmit';
import { CompanyProfileFormSchema } from './CompanyProfileSchema';
import type { CompanyProfileField } from './CompanyProfileSchema';
import {
  PageContent,
  ProfileHeaderCard,
  HeaderRow,
  HeaderTop,
  IdBlock,
  HeaderTitle,
  HeaderTagline,
  HeaderMetaRow,
  HeaderMetaDot,
  HeaderActionsRow,
  CopyLinkWrap,
  CopyLinkButton,
  CopyTooltip,
  TabsWrapper,
  StyledTabs,
  StyledTab,
  TabContent,
  SectionsGrid,
  SideCol,
  SectionCard,
  SectionTitle,
  FieldsGrid,
  InfoGroup,
  InfoGroupLabel,
  InfoRow,
  InfoIconBadge,
  InfoRowMain,
  InfoRowLabel,
  InfoRowValue,
  InfoAddButton,
  EmptyCard,
  EmptyCardIconBadge,
  EmptyCardTitle,
  EmptyCardText,
  LoadingContainer,
} from './CompanyProfile.styles';
import type { CompanyProfileFormData } from './ICompanyProfile';
import { BillingSettings } from '../../settings/BillingSettings';
import { LogoUpload, CompanySnapshot, DocumentsTab, PostsTab, SchemaField } from './components';

const TABS = ['overview', 'documents', 'posts', 'billing'] as const;
const DEFAULT_TAGLINE_PROMPT = 'Add a tagline to tell people what your company does';

type SchemaEntry = [keyof CompanyProfileFormData, CompanyProfileField];

const SCHEMA_ENTRIES = Object.entries(CompanyProfileFormSchema) as SchemaEntry[];
const COMPANY_GRID_FIELDS = SCHEMA_ENTRIES.filter(
  ([key, field]) => field.section === 'company' && key !== 'name' && key !== 'description'
);
const READ_ONLY_COMPANY_FIELDS = SCHEMA_ENTRIES.filter(([key, field]) => field.section === 'company' && key !== 'name');
const GENERAL_FIELDS = READ_ONLY_COMPANY_FIELDS.filter(([, field]) => field.group === 'general');
const CONTACT_FIELDS = READ_ONLY_COMPANY_FIELDS.filter(([, field]) => field.group === 'contact');
const BUSINESS_FIELDS = READ_ONLY_COMPANY_FIELDS.filter(([, field]) => field.group === 'business');
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
  const [linkCopied, setLinkCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleCopyPublicLink = useCallback(async () => {
    if (!profile?.id) return;
    const slug = profile.name ? slugify(profile.name) : '';
    const link = `${window.location.origin}/public/company/${profile.id}${slug ? `/${slug}` : ''}`;
    const success = await copyToClipboard(link);
    if (success) {
      setLinkCopied(true);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setLinkCopied(false), 1600);
    } else {
      showError('Failed to copy link.');
    }
  }, [profile?.id, profile?.name, showError]);

  const renderInfoRow = ([key, field]: SchemaEntry) => {
    const Icon = field.icon;
    const value = profileValues?.[key];
    const isTextarea = field.control === 'textarea';
    return (
      <InfoRow key={key}>
        {Icon && (
          <InfoIconBadge>
            <Icon fontSize="small" />
          </InfoIconBadge>
        )}
        <InfoRowMain>
          <InfoRowLabel>{field.label}</InfoRowLabel>
          {value ? (
            <InfoRowValue>{value}</InfoRowValue>
          ) : !isTextarea && canEdit ? (
            <InfoAddButton type="button" onClick={handleEdit}>
              + Add {field.label}
            </InfoAddButton>
          ) : (
            <InfoRowValue $empty>Not provided</InfoRowValue>
          )}
        </InfoRowMain>
      </InfoRow>
    );
  };

  const renderPlainInfoRow = (
    [key, field]: SchemaEntry,
    Icon: React.ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>
  ) => {
    const value = profileValues?.[key];
    return (
      <InfoRow key={key}>
        <InfoIconBadge>
          <Icon fontSize="small" />
        </InfoIconBadge>
        <InfoRowMain>
          <InfoRowLabel>{field.label}</InfoRowLabel>
          <InfoRowValue $empty={!value}>{value || 'Not provided'}</InfoRowValue>
        </InfoRowMain>
      </InfoRow>
    );
  };

  if (isLoading) {
    return (
      <PageContent>
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      </PageContent>
    );
  }

  return (
    <FormProvider {...methods}>
      <PageContent>
        <ProfileHeaderCard>
          <HeaderRow>
            <LogoUpload
              logoUrl={profile?.logoUrl}
              companyName={profile?.name}
              editable={canEdit}
              onLogoChange={handleLogoChange}
            />

            <HeaderTop>
              <IdBlock>
                <HeaderTitle>{profile?.name || 'Company'}</HeaderTitle>
                <HeaderTagline>{profile?.tagline || DEFAULT_TAGLINE_PROMPT}</HeaderTagline>
                {(profile?.email || profile?.currency) && (
                  <HeaderMetaRow>
                    {profile?.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
                    {profile?.email && profile?.currency && <HeaderMetaDot>&bull;</HeaderMetaDot>}
                    {profile?.currency && <span>Currency: {profile.currency}</span>}
                  </HeaderMetaRow>
                )}
              </IdBlock>

              <HeaderActionsRow>
                {profile?.id && (
                  <CopyLinkWrap>
                    <CopyLinkButton
                      type="button"
                      $copied={linkCopied}
                      onClick={handleCopyPublicLink}
                      aria-label="Copy public profile link"
                      title="Copy public profile link"
                    >
                      {linkCopied ? <CheckIcon /> : <IosShareOutlinedIcon />}
                    </CopyLinkButton>
                    <CopyTooltip $visible={linkCopied}>Copied!</CopyTooltip>
                  </CopyLinkWrap>
                )}

                {activeTab === TABS.indexOf('overview') &&
                  canEdit &&
                  (isEditing ? (
                    <>
                      <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  ))}
              </HeaderActionsRow>
            </HeaderTop>
          </HeaderRow>

          <TabsWrapper>
            <StyledTabs value={activeTab} onChange={(_: SyntheticEvent, val: number) => setActiveTab(val)}>
              <StyledTab label="Overview" />
              <StyledTab label="Documents" />
              <StyledTab label="Posts" />
              <StyledTab label="Billing" />
            </StyledTabs>
          </TabsWrapper>
        </ProfileHeaderCard>

        {activeTab === TABS.indexOf('documents') && (
          <TabContent>
            <DocumentsTab />
          </TabContent>
        )}

        {activeTab === TABS.indexOf('posts') && (
          <TabContent>
            <PostsTab companyName={profile?.name} />
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

                {isEditing ? (
                  <>
                    <SchemaField
                      isEditing
                      name="name"
                      field={CompanyProfileFormSchema.name}
                      error={errors.name}
                      viewValue={profileValues?.name}
                    />
                    <SchemaField
                      isEditing
                      name="description"
                      field={CompanyProfileFormSchema.description}
                      viewValue={profileValues?.description}
                    />
                    <FieldsGrid>
                      {COMPANY_GRID_FIELDS.map(([key, field]) => (
                        <SchemaField
                          key={key}
                          isEditing
                          name={key}
                          field={field}
                          error={errors[key] as FieldError | undefined}
                          viewValue={profileValues?.[key]}
                        />
                      ))}
                    </FieldsGrid>
                  </>
                ) : (
                  <>
                    <InfoGroup>
                      <InfoGroupLabel>General</InfoGroupLabel>
                      {GENERAL_FIELDS.map(renderInfoRow)}
                    </InfoGroup>
                    <InfoGroup>
                      <InfoGroupLabel>Contact</InfoGroupLabel>
                      {CONTACT_FIELDS.map(renderInfoRow)}
                    </InfoGroup>
                    <InfoGroup>
                      <InfoGroupLabel>Business</InfoGroupLabel>
                      {BUSINESS_FIELDS.map(renderInfoRow)}
                    </InfoGroup>
                  </>
                )}
              </SectionCard>

              <SideCol>
                {/* Address */}
                <SectionCard>
                  <SectionTitle>Address</SectionTitle>
                  {isEditing ? (
                    <FieldsGrid>
                      {ADDRESS_FIELDS.map(([key, field]) => (
                        <SchemaField
                          key={key}
                          isEditing
                          name={key}
                          field={field}
                          error={errors[key] as FieldError | undefined}
                          viewValue={profileValues?.[key]}
                        />
                      ))}
                    </FieldsGrid>
                  ) : hasAddressData ? (
                    ADDRESS_FIELDS.map((entry) => renderPlainInfoRow(entry, PlaceOutlinedIcon))
                  ) : (
                    <EmptyCard>
                      <EmptyCardIconBadge>
                        <PlaceOutlinedIcon />
                      </EmptyCardIconBadge>
                      <EmptyCardTitle>Address</EmptyCardTitle>
                      <EmptyCardText>No address on file yet.</EmptyCardText>
                      {canEdit && (
                        <Button variant="outlined" color="secondary" size="small" onClick={handleEdit}>
                          + Add Address
                        </Button>
                      )}
                    </EmptyCard>
                  )}
                </SectionCard>

                {/* Bank Details */}
                <SectionCard>
                  <SectionTitle>Bank Details</SectionTitle>
                  {isEditing ? (
                    <FieldsGrid>
                      {BANK_FIELDS.map(([key, field]) => (
                        <SchemaField
                          key={key}
                          isEditing
                          name={key}
                          field={field}
                          error={errors[key] as FieldError | undefined}
                          viewValue={profileValues?.[key]}
                        />
                      ))}
                    </FieldsGrid>
                  ) : hasBankData ? (
                    BANK_FIELDS.map((entry) => renderPlainInfoRow(entry, AccountBalanceOutlinedIcon))
                  ) : (
                    <EmptyCard>
                      <EmptyCardIconBadge>
                        <AccountBalanceOutlinedIcon />
                      </EmptyCardIconBadge>
                      <EmptyCardTitle>Bank Details</EmptyCardTitle>
                      <EmptyCardText>No bank details on file yet.</EmptyCardText>
                      {canEdit && (
                        <Button variant="outlined" color="secondary" size="small" onClick={handleEdit}>
                          + Add Bank Details
                        </Button>
                      )}
                    </EmptyCard>
                  )}
                </SectionCard>
              </SideCol>
            </SectionsGrid>
          </>
        )}
      </PageContent>
    </FormProvider>
  );
};

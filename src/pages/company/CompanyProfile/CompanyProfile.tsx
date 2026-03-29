import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { Snackbar } from '../../../components/UI/Snackbar';
import { companyService } from '../../../services/api';
import type { CompanyProfileResponse } from '../../../services/api';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { CompanyProfileFormSchema } from './CompanyProfileSchema';
import {
  PageContainer,
  PageHeader,
  Title,
  HeaderActions,
  SectionsGrid,
  SectionCard,
  SectionTitle,
  FieldRow,
  FieldLabel,
  FieldValue,
  FieldsGrid,
  LoadingContainer,
} from './CompanyProfile.styles';
import type { CompanyProfileFormData } from './ICompanyProfile';

const EMPTY = '—';

export const CompanyProfile: React.FC = () => {
  const { fieldRules, placeHolders, fieldLabels } = useSchema(CompanyProfileFormSchema);

  const methods = useForm<CompanyProfileFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues: {
      name: '',
      email: '',
      contactEmail: '',
      contactNumber: '',
      telephone: '',
      mobile: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      town: '',
      country: '',
      postcode: '',
      vatNumber: '',
      bankName: '',
      accountName: '',
      accountNo: '',
      sortCode: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [profile, setProfile] = useState<CompanyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', variant: 'success' });

  const buildFormValues = (data: CompanyProfileResponse) => ({
    name: data.name || '',
    email: data.email || '',
    contactEmail: data.contactEmail || '',
    contactNumber: data.contactNumber || '',
    telephone: data.telephone || '',
    mobile: data.mobile || '',
    addressLine1: data.address?.addressLine1 || '',
    addressLine2: data.address?.addressLine2 || '',
    addressLine3: data.address?.addressLine3 || '',
    town: data.address?.town || '',
    country: data.address?.country || '',
    postcode: data.address?.postcode || '',
    vatNumber: data.vatNumber || '',
    bankName: data.bankDetails?.bankName || '',
    accountName: data.bankDetails?.accountName || '',
    accountNo: data.bankDetails?.accountNo || '',
    sortCode: data.bankDetails?.sortCode || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await companyService.getProfile();
        setProfile(response.data);
        reset(buildFormValues(response.data));
      } catch (error) {
        console.error('Failed to fetch company profile:', error);
        setSnackbar({
          open: true,
          message: extractErrorMessage(error, 'Failed to load company profile.'),
          variant: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: CompanyProfileFormData) => {
    setIsSaving(true);
    try {
      const response = await companyService.updateProfile({
        name: data.name,
        email: data.email || undefined,
        contactEmail: data.contactEmail || undefined,
        contactNumber: data.contactNumber || undefined,
        telephone: data.telephone || undefined,
        mobile: data.mobile || undefined,
        address: {
          addressLine1: data.addressLine1 || undefined,
          addressLine2: data.addressLine2 || undefined,
          addressLine3: data.addressLine3 || undefined,
          town: data.town || undefined,
          country: data.country || undefined,
          postcode: data.postcode || undefined,
        },
        vatNumber: data.vatNumber || undefined,
        bankDetails: {
          bankName: data.bankName || undefined,
          accountName: data.accountName || undefined,
          accountNo: data.accountNo || undefined,
          sortCode: data.sortCode || undefined,
        },
      });
      setProfile(response.data);
      setIsEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully.', variant: 'success' });
    } catch (error) {
      console.error('Failed to update company profile:', error);
      setSnackbar({
        open: true,
        message: extractErrorMessage(error, 'Failed to update profile. Please try again.'),
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profile) reset(buildFormValues(profile));
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <FormProvider {...methods}>
      <PageContainer>
        <PageHeader>
          <Title>Company Profile</Title>
          <HeaderActions>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" size="medium" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </HeaderActions>
        </PageHeader>

        <SectionsGrid>
          {/* Company Information */}
          <SectionCard>
            <SectionTitle>Company Information</SectionTitle>

            {isEditing ? (
              <>
                <Input
                  name="name"
                  label={fieldLabels.name}
                  type="text"
                  placeholder={placeHolders.name}
                  fullWidth
                  error={errors.name}
                />
                <FieldsGrid>
                  <Input
                    name="email"
                    label={fieldLabels.email}
                    type="email"
                    placeholder={placeHolders.email}
                    fullWidth
                    error={errors.email}
                  />
                  <Input
                    name="contactEmail"
                    label={fieldLabels.contactEmail}
                    type="email"
                    placeholder={placeHolders.contactEmail}
                    fullWidth
                    error={errors.contactEmail}
                  />
                  <Input
                    name="contactNumber"
                    label={fieldLabels.contactNumber}
                    type="text"
                    placeholder={placeHolders.contactNumber}
                    fullWidth
                    error={errors.contactNumber}
                  />
                  <Input
                    name="telephone"
                    label={fieldLabels.telephone}
                    type="text"
                    placeholder={placeHolders.telephone}
                    fullWidth
                    error={errors.telephone}
                  />
                  <Input
                    name="mobile"
                    label={fieldLabels.mobile}
                    type="text"
                    placeholder={placeHolders.mobile}
                    fullWidth
                    error={errors.mobile}
                  />
                  <Input
                    name="vatNumber"
                    label={fieldLabels.vatNumber}
                    type="text"
                    placeholder={placeHolders.vatNumber}
                    fullWidth
                    error={errors.vatNumber}
                  />
                </FieldsGrid>
              </>
            ) : (
              <>
                <FieldRow>
                  <FieldLabel>Company Name</FieldLabel>
                  <FieldValue>{profile?.name || EMPTY}</FieldValue>
                </FieldRow>
                <FieldsGrid>
                  <FieldRow>
                    <FieldLabel>Email</FieldLabel>
                    <FieldValue>{profile?.email || EMPTY}</FieldValue>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Contact Email</FieldLabel>
                    <FieldValue>{profile?.contactEmail || EMPTY}</FieldValue>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Contact Number</FieldLabel>
                    <FieldValue>{profile?.contactNumber || EMPTY}</FieldValue>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Telephone</FieldLabel>
                    <FieldValue>{profile?.telephone || EMPTY}</FieldValue>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>Mobile</FieldLabel>
                    <FieldValue>{profile?.mobile || EMPTY}</FieldValue>
                  </FieldRow>
                  <FieldRow>
                    <FieldLabel>VAT Number</FieldLabel>
                    <FieldValue>{profile?.vatNumber || EMPTY}</FieldValue>
                  </FieldRow>
                </FieldsGrid>
              </>
            )}
          </SectionCard>

          {/* Address */}
          <SectionCard>
            <SectionTitle>Address</SectionTitle>

            {isEditing ? (
              <FieldsGrid>
                <Input
                  name="addressLine1"
                  label={fieldLabels.addressLine1}
                  type="text"
                  placeholder={placeHolders.addressLine1}
                  fullWidth
                  error={errors.addressLine1}
                />
                <Input
                  name="addressLine2"
                  label={fieldLabels.addressLine2}
                  type="text"
                  placeholder={placeHolders.addressLine2}
                  fullWidth
                  error={errors.addressLine2}
                />
                <Input
                  name="addressLine3"
                  label={fieldLabels.addressLine3}
                  type="text"
                  placeholder={placeHolders.addressLine3}
                  fullWidth
                  error={errors.addressLine3}
                />
                <Input
                  name="town"
                  label={fieldLabels.town}
                  type="text"
                  placeholder={placeHolders.town}
                  fullWidth
                  error={errors.town}
                />
                <Input
                  name="country"
                  label={fieldLabels.country}
                  type="text"
                  placeholder={placeHolders.country}
                  fullWidth
                  error={errors.country}
                />
                <Input
                  name="postcode"
                  label={fieldLabels.postcode}
                  type="text"
                  placeholder={placeHolders.postcode}
                  fullWidth
                  error={errors.postcode}
                />
              </FieldsGrid>
            ) : (
              <FieldsGrid>
                <FieldRow>
                  <FieldLabel>Address Line 1</FieldLabel>
                  <FieldValue>{profile?.address?.addressLine1 || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Address Line 2</FieldLabel>
                  <FieldValue>{profile?.address?.addressLine2 || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Address Line 3</FieldLabel>
                  <FieldValue>{profile?.address?.addressLine3 || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Town / City</FieldLabel>
                  <FieldValue>{profile?.address?.town || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Country</FieldLabel>
                  <FieldValue>{profile?.address?.country || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Postcode</FieldLabel>
                  <FieldValue>{profile?.address?.postcode || EMPTY}</FieldValue>
                </FieldRow>
              </FieldsGrid>
            )}
          </SectionCard>

          {/* Bank Details */}
          <SectionCard>
            <SectionTitle>Bank Details</SectionTitle>

            {isEditing ? (
              <FieldsGrid>
                <Input
                  name="bankName"
                  label={fieldLabels.bankName}
                  type="text"
                  placeholder={placeHolders.bankName}
                  fullWidth
                  error={errors.bankName}
                />
                <Input
                  name="accountName"
                  label={fieldLabels.accountName}
                  type="text"
                  placeholder={placeHolders.accountName}
                  fullWidth
                  error={errors.accountName}
                />
                <Input
                  name="accountNo"
                  label={fieldLabels.accountNo}
                  type="text"
                  placeholder={placeHolders.accountNo}
                  fullWidth
                  error={errors.accountNo}
                />
                <Input
                  name="sortCode"
                  label={fieldLabels.sortCode}
                  type="text"
                  placeholder={placeHolders.sortCode}
                  fullWidth
                  error={errors.sortCode}
                />
              </FieldsGrid>
            ) : (
              <FieldsGrid>
                <FieldRow>
                  <FieldLabel>Bank Name</FieldLabel>
                  <FieldValue>{profile?.bankDetails?.bankName || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Account Name</FieldLabel>
                  <FieldValue>{profile?.bankDetails?.accountName || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Account Number</FieldLabel>
                  <FieldValue>{profile?.bankDetails?.accountNo || EMPTY}</FieldValue>
                </FieldRow>
                <FieldRow>
                  <FieldLabel>Sort Code</FieldLabel>
                  <FieldValue>{profile?.bankDetails?.sortCode || EMPTY}</FieldValue>
                </FieldRow>
              </FieldsGrid>
            )}
          </SectionCard>
        </SectionsGrid>

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          variant={snackbar.variant}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </PageContainer>
    </FormProvider>
  );
};

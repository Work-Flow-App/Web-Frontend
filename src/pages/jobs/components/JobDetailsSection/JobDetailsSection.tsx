import React, { useState, useEffect } from 'react';
import { Box, OutlinedInput, IconButton, CircularProgress, Select, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlaceIcon from '@mui/icons-material/Place';
import DescriptionIcon from '@mui/icons-material/Description';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory2';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SyncIcon from '@mui/icons-material/Sync';
import LabelIcon from '@mui/icons-material/Label';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { JOB_STATUS_OPTIONS } from '../../../../enums';
import { customerService, assetService, jobService, companyClientService } from '../../../../services/api';
import type {
  JobResponse,
  JobUpdateRequest,
  ClientResponse,
  ClientUpdateRequest,
  CustomerResponse,
  CustomerUpdateRequest,
  JobTemplateResponse,
  JobTemplateFieldResponse,
  AssetResponse
} from '../../../../services/api';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { AssignAssetModal } from '../../../assets/components';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap/GoogleMap.types';
import { GOOGLE_MAPS_CONFIG } from '../../../../config/googleMaps';
import { geocodeAddress, formatAddress } from '../../../../utils/googleGeocoding';
import { extractFieldValue } from '../../../../utils/fieldValueHelper';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import {
  isAddressField,
  parseAddressFieldValue,
  formatAddressFieldValue,
  rebuildFieldValuesForResend,
} from '../../../../utils/customAddressField';
import * as S from './JobDetailsSection.styles';

interface JobDetailsSectionProps {
  job: JobResponse;
  client: ClientResponse | null;
  customer: CustomerResponse | null;
  template: JobTemplateResponse | null;
  templateFields: JobTemplateFieldResponse[];
  title: string;
  onJobUpdate?: (updatedJob: JobResponse) => void;
  onCustomerUpdate?: (updatedCustomer: CustomerResponse) => void;
  onClientUpdate?: (updatedClient: ClientResponse) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatStatus = (status?: string) => {
  if (!status) return '-';
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

const toDateInputValue = (value: string): string => {
  if (!value) return '';
  return value.split('T')[0];
};

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  job,
  client,
  customer,
  template,
  templateFields,
  title,
  onJobUpdate,
  onCustomerUpdate,
  onClientUpdate,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  // Available assets for display mapping
  const [allAssets, setAllAssets] = useState<AssetResponse[]>([]);

  // Editing state for specific fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingField, setSavingField] = useState<string | null>(null);

  // Map editing state (shared between customer address and job site address)
  const [selectedMapAddress, setSelectedMapAddress] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(GOOGLE_MAPS_CONFIG.defaultZoom);

  const hasCustomer = !!customer;
  const contactEmail = customer?.email || client?.email;
  const contactTelephone = customer?.telephone || client?.telephone;
  const contactMobile = customer?.mobile || client?.mobile;
  // Was showing only customer.address.street (no city/postcode/country) — the
  // Address row never actually included the postcode for customers.
  const contactAddress = hasCustomer
    ? formatAddress({
        street: customer?.address?.street,
        city: customer?.address?.city,
        state: customer?.address?.county,
        postalCode: customer?.address?.postalCode,
        country: customer?.address?.country,
      })
    : client?.address;

  const handleAddressEditClick = async (target: 'address' | 'siteAddress') => {
    setEditingField(target);
    const source = target === 'address' ? customer?.address : job.address;
    const street = source?.street || '';
    setEditValue(street);

    if (street) {
      const structured = await geocodeAddress(street);
      if (structured) {
        setSelectedMapAddress({
          address: street,
          streetLine: structured.streetLine,
          location: structured.location,
          city: source?.city,
          state: target === 'address' ? customer?.address?.county : job.address?.state,
          postalCode: source?.postalCode,
          country: source?.country,
        });
        setMapCenter(structured.location);
        setMapZoom(15);
        return;
      }
    }

    setSelectedMapAddress(null);
    setMapCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
    setMapZoom(GOOGLE_MAPS_CONFIG.defaultZoom);
  };

  const handleLocationSelect = (place: PlaceDetails) => {
    setSelectedMapAddress(place);
    setEditValue(place.address);
    setMapCenter(place.location);
    setMapZoom(15);
    handleSaveAddress(place);
  };

  const handleSaveAddress = async (place: PlaceDetails) => {
    const target = editingField as 'address' | 'siteAddress';
    setSavingField(target);
    try {
      if (target === 'address') {
        const addressObj = {
          // Prefer the parsed street line over the full formatted address —
          // `.address` includes city/postcode/country, and saving that into
          // "street" is what produced duplicated-looking addresses once city/
          // postcode/country were also stored and later joined back together.
          street: place.streetLine || place.address || '',
          city: place.city || customer?.address?.city || '',
          county: place.state || customer?.address?.county || '',
          postalCode: place.postalCode || customer?.address?.postalCode || '',
          country: place.country || customer?.address?.country || '',
        };
        if (customer?.id) {
          const updateReq: CustomerUpdateRequest = {
            name: customer.name || '',
            email: customer.email,
            telephone: customer.telephone,
            mobile: customer.mobile,
            address: addressObj,
          };
          const res = await customerService.updateCustomer(customer.id, updateReq);
          onCustomerUpdate?.(res.data);
        } else {
          const defaultName = `Customer for Job #${job.id || ''}`;
          const createReq = {
            name: defaultName,
            address: addressObj,
          };
          const res = await customerService.createCustomer(createReq);
          const newCust = res.data;
          if (job.id && newCust.id) {
            const jobRes = await jobService.updateJob(job.id, { customerId: newCust.id });
            onJobUpdate?.(jobRes.data);
          }
          onCustomerUpdate?.(newCust);
        }
      } else if (target === 'siteAddress' && job.id) {
        const updateReq: JobUpdateRequest = {
          address: {
            street: place.streetLine || place.address || '',
            city: place.city || job.address?.city || '',
            state: place.state || job.address?.state || '',
            postalCode: place.postalCode || job.address?.postalCode || '',
            country: place.country || job.address?.country || '',
            additionalInfo: job.address?.additionalInfo,
            latitude: place.location?.lat ?? job.address?.latitude,
            longitude: place.location?.lng ?? job.address?.longitude,
          },
        };
        const res = await jobService.updateJob(job.id, updateReq);
        onJobUpdate?.(res.data);
      }
      showSuccess('Updated address successfully');
      setEditingField(null);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to update address');
      console.error('[handleSaveAddress] Failed:', err);
      showError(msg);
    } finally {
      setSavingField(null);
    }
  };

  useEffect(() => {
    assetService.getAllAssets(0, 200, false, true)
      .then((res) => {
        const content = res.data.content ?? (res.data as unknown as AssetResponse[]);
        setAllAssets(Array.isArray(content) ? content : []);
      })
      .catch(() => setAllAssets([]));
  }, []);

  const handleEditClick = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSaveField = async (field: string) => {
    setSavingField(field);
    try {
      if (field === 'customerName') {
        if (customer?.id) {
          const updateReq: CustomerUpdateRequest = {
            name: editValue,
            email: customer.email,
            telephone: customer.telephone,
            mobile: customer.mobile,
            address: customer.address,
          };
          const res = await customerService.updateCustomer(customer.id, updateReq);
          onCustomerUpdate?.(res.data);
        } else {
          const res = await customerService.createCustomer({ name: editValue });
          const newCust = res.data;
          if (job.id && newCust.id) {
            const jobRes = await jobService.updateJob(job.id, { customerId: newCust.id });
            onJobUpdate?.(jobRes.data);
          }
          onCustomerUpdate?.(newCust);
        }
      } else if (field === 'clientName') {
        if (client?.id) {
          const updateReq: ClientUpdateRequest = {
            name: editValue,
            email: client.email,
            telephone: client.telephone,
            mobile: client.mobile,
            address: client.address,
          };
          const res = await companyClientService.updateClient(client.id, updateReq);
          onClientUpdate?.(res.data);
        } else {
          const res = await companyClientService.createClient({ name: editValue });
          const newClient = res.data;
          if (job.id && newClient.id) {
            const jobRes = await jobService.updateJob(job.id, { clientId: newClient.id });
            onJobUpdate?.(jobRes.data);
          }
          onClientUpdate?.(newClient);
        }
      } else if (['email', 'telephone', 'mobile', 'address'].includes(field)) {
        if (customer?.id) {
          const updateReq: CustomerUpdateRequest = {
            name: customer.name || '',
            email: field === 'email' ? editValue : customer.email,
            telephone: field === 'telephone' ? editValue : customer.telephone,
            mobile: field === 'mobile' ? editValue : customer.mobile,
            address: customer.address,
          };
          const res = await customerService.updateCustomer(customer.id, updateReq);
          onCustomerUpdate?.(res.data);
        } else if (client?.id) {
          const updateReq: ClientUpdateRequest = {
            name: client.name || '',
            email: field === 'email' ? editValue : client.email,
            telephone: field === 'telephone' ? editValue : client.telephone,
            mobile: field === 'mobile' ? editValue : client.mobile,
            address: field === 'address' ? editValue : client.address,
          };
          const res = await companyClientService.updateClient(client.id, updateReq);
          onClientUpdate?.(res.data);
        } else {
          const defaultName = `Customer for Job #${job.id || ''}`;
          const createReq = {
            name: defaultName,
            email: field === 'email' ? editValue : undefined,
            telephone: field === 'telephone' ? editValue : undefined,
            mobile: field === 'mobile' ? editValue : undefined,
            address: field === 'address' ? { street: editValue } : undefined,
          };
          const res = await customerService.createCustomer(createReq);
          const newCust = res.data;
          if (job.id && newCust.id) {
            const jobRes = await jobService.updateJob(job.id, { customerId: newCust.id });
            onJobUpdate?.(jobRes.data);
          }
          onCustomerUpdate?.(newCust);
        }
      } else if (field === 'status' && job.id) {
        const updateReq: JobUpdateRequest = { status: editValue as JobUpdateRequest['status'] };
        const res = await jobService.updateJob(job.id, updateReq);
        onJobUpdate?.(res.data);
      }
      showSuccess('Updated successfully');
      setEditingField(null);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to update');
      console.error('[handleSaveField] Failed:', err);
      showError(msg);
    } finally {
      setSavingField(null);
    }
  };

  const getAssetName = (id: number): string => {
    const asset = allAssets.find((a) => a.id === id);
    return asset?.name || `Asset #${id}`;
  };

  const assetNames = job.assetIds?.map(getAssetName).join(', ');

  const handleAssignAsset = () => {
    if (!job.id) return;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'assignAsset',
      children: (
        <AssignAssetModal
          jobId={job.id}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            // Trigger a refresh of the job details to show the new asset
            jobService.getJobById(job.id!).then((res) => onJobUpdate?.(res.data));
          }}
        />
      ),
    });
  };

  const handleReturnAsset = async () => {
    if (!job.id) return;
    try {
      const res = await assetService.getJobAssignments(job.id, true);
      const assignments = Array.isArray(res.data) ? res.data : [];
      if (assignments.length > 0) {
        setGlobalModalOuterProps({
          isOpen: true,
          size: ModalSizes.SMALL,
          fieldName: 'returnAsset',
          children: (
            <ConfirmationModal
              title="Return Asset"
              message="Are you sure you want to return the assigned asset(s)?"
              confirmButtonText="Return Asset"
              cancelButtonText="Cancel"
              onConfirm={async () => {
                try {
                  for (const assignment of assignments) {
                    if (assignment.assignmentId) {
                      await assetService.returnAsset({
                        assignmentId: assignment.assignmentId,
                        notes: 'Returned from job details',
                      });
                    }
                  }
                  showSuccess('Asset(s) returned successfully');
                  resetGlobalModalOuterProps();
                  jobService.getJobById(job.id!).then((res) => onJobUpdate?.(res.data));
                } catch {
                  showError('Failed to return asset');
                  resetGlobalModalOuterProps();
                }
              }}
              onCancel={resetGlobalModalOuterProps}
            />
          ),
        });
      } else {
        showError('No active assignments found to return');
      }
    } catch {
      showError('Failed to fetch assignments');
    }
  };

  const renderEditableRow = (
    icon: React.ReactNode,
    label: string,
    fieldKey: string,
    value?: string | null,
    allowEdit: boolean = true
  ) => {
    const isEditing = editingField === fieldKey;
    const isSaving = savingField === fieldKey;
    const displayValue = value || '';
    const notSet = !value;
    const isMapAddressField = fieldKey === 'siteAddress' || (fieldKey === 'address' && hasCustomer);

    if (isMapAddressField) {
      return (
        <S.FieldRow>
          <S.FieldIconContainer>{icon}</S.FieldIconContainer>
          <S.FieldLabel>{label}</S.FieldLabel>
          <S.FieldValue $notSet={notSet}>{notSet ? 'Not set' : displayValue}</S.FieldValue>
          {allowEdit && (
            <S.FieldAction>
              <S.ActionButton
                variant="text"
                onClick={() =>
                  isEditing ? handleCancelEdit() : handleAddressEditClick(fieldKey as 'address' | 'siteAddress')
                }
              >
                {isEditing ? 'Cancel' : notSet ? 'Add' : 'Edit'}
              </S.ActionButton>
            </S.FieldAction>
          )}
        </S.FieldRow>
      );
    }

    return (
      <S.FieldRow>
        <S.FieldIconContainer>{icon}</S.FieldIconContainer>
        <S.FieldLabel>{label}</S.FieldLabel>

        {isEditing ? (
          <S.InlineEditContainer>
            <OutlinedInput
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={isSaving}
              autoFocus
              sx={{ flex: 1, height: '2rem', fontSize: '0.875rem' }}
            />
            {isSaving ? (
              <CircularProgress size={16} sx={{ ml: 1 }} />
            ) : (
              <Box display="flex">
                <IconButton size="small" onClick={() => handleSaveField(fieldKey)} color="primary">
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleCancelEdit} color="error">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </S.InlineEditContainer>
        ) : (
          <>
            <S.FieldValue $notSet={notSet}>{notSet ? 'Not set' : displayValue}</S.FieldValue>
            {allowEdit && (
              <S.FieldAction>
                <S.ActionButton
                  variant="text"
                  onClick={() => handleEditClick(fieldKey, displayValue)}
                >
                  {notSet ? 'Add' : 'Edit'}
                </S.ActionButton>
              </S.FieldAction>
            )}
          </>
        )}
      </S.FieldRow>
    );
  };

  // ── Template custom fields ──
  const sortedTemplateFields = [...templateFields].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  const getRawFieldValue = (fieldId: number): string => {
    if (!job.fieldValues) return '';
    // Look up by numeric id string first, then fallback to other keys
    const fieldValue = job.fieldValues[String(fieldId)];
    if (fieldValue === undefined || fieldValue === null) return '';
    return extractFieldValue(fieldValue);
  };

  const getDisplayFieldValue = (field: JobTemplateFieldResponse): string => {
    if (isAddressField(field)) {
      return formatAddressFieldValue(job.fieldValues?.[String(field.id)]);
    }
    const raw = getRawFieldValue(field.id!);
    if (!raw) return '';
    if (field.jobFieldType === 'DATE') return formatDate(raw);
    if (field.jobFieldType === 'BOOLEAN') return raw === 'true' ? 'Yes' : 'No';
    return raw;
  };

  const renderCustomFieldRow = (field: JobTemplateFieldResponse) => {
    const fieldKey = `customField:${field.id}`;
    const isEditing = editingField === fieldKey;
    const isSaving = savingField === fieldKey;
    const rawValue = getRawFieldValue(field.id!);
    const displayValue = getDisplayFieldValue(field);
    const notSet = !rawValue;
    const label = `${field.required ? '* ' : ''}${field.label || field.name || ''}`;

    if (isAddressField(field)) {
      const handleCustomAddressEditClick = () => {
        setEditingField(fieldKey);
        const parsed = parseAddressFieldValue(job.fieldValues?.[String(field.id)]);
        if (parsed) {
          const location = {
            lat: parsed.latitude ?? GOOGLE_MAPS_CONFIG.defaultCenter.lat,
            lng: parsed.longitude ?? GOOGLE_MAPS_CONFIG.defaultCenter.lng,
          };
          setSelectedMapAddress({
            address: displayValue,
            streetLine: parsed.street,
            city: parsed.city,
            state: parsed.state,
            postalCode: parsed.postalCode,
            country: parsed.country,
            location,
          });
          setMapCenter(location);
          setMapZoom(15);
          return;
        }
        setSelectedMapAddress(null);
        setMapCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
        setMapZoom(GOOGLE_MAPS_CONFIG.defaultZoom);
      };

      const handleCustomAddressSelect = async (place: PlaceDetails) => {
        if (!job.id || field.id === undefined) return;
        setSelectedMapAddress(place);
        setSavingField(fieldKey);
        try {
          const rebuilt = rebuildFieldValuesForResend(job.fieldValues, templateFields);
          rebuilt[String(field.id)] = {
            street: place.streetLine || place.address || '',
            city: place.city || '',
            state: place.state || '',
            postalCode: place.postalCode || '',
            country: place.country || '',
            latitude: place.location?.lat ?? null,
            longitude: place.location?.lng ?? null,
          };
          const res = await jobService.updateJob(job.id, { fieldValues: rebuilt });
          onJobUpdate?.(res.data);
          showSuccess('Updated successfully');
          setEditingField(null);
        } catch (err) {
          const msg = extractErrorMessage(err, 'Failed to update');
          console.error('[handleCustomAddressSelect] Failed:', err);
          showError(msg);
        } finally {
          setSavingField(null);
        }
      };

      return (
        <React.Fragment key={fieldKey}>
          <S.FieldRow>
            <S.FieldIconContainer><LabelIcon /></S.FieldIconContainer>
            <S.FieldLabel>{label}</S.FieldLabel>
            <S.FieldValue $notSet={notSet}>{notSet ? 'Not set' : displayValue}</S.FieldValue>
            <S.FieldAction>
              <S.ActionButton
                variant="text"
                onClick={() => (isEditing ? handleCancelEdit() : handleCustomAddressEditClick())}
              >
                {isEditing ? 'Cancel' : notSet ? 'Add' : 'Edit'}
              </S.ActionButton>
            </S.FieldAction>
          </S.FieldRow>
          {isEditing && (
            <S.MapEditWrapper>
              <S.StyledGoogleMap
                height="15rem"
                center={mapCenter}
                zoom={mapZoom}
                markers={selectedMapAddress ? [selectedMapAddress] : []}
                selectedLocation={selectedMapAddress}
                onLocationSelect={handleCustomAddressSelect}
                confirmBeforeSelect
                showSearchBox
                searchInitialValue={displayValue || undefined}
              />
              {isSaving && <CircularProgress size={16} />}
            </S.MapEditWrapper>
          )}
        </React.Fragment>
      );
    }

    const handleFieldEditClick = () => {
      setEditingField(fieldKey);
      setEditValue(field.jobFieldType === 'DATE' ? toDateInputValue(rawValue) : rawValue);
    };

    const handleFieldSave = async () => {
      setSavingField(fieldKey);
      try {
        if (job.id && field.id !== undefined) {
          // Resend every field, preserving any OTHER address-type field as its real
          // structured object instead of flattening it to a string (see
          // rebuildFieldValuesForResend's doc comment for why that matters).
          const updatedFieldValues = rebuildFieldValuesForResend(job.fieldValues, templateFields);
          if (editValue === '') {
            delete updatedFieldValues[String(field.id)];
          } else {
            updatedFieldValues[String(field.id)] = editValue;
          }
          const res = await jobService.updateJob(job.id, { fieldValues: updatedFieldValues });
          onJobUpdate?.(res.data);
        }
        showSuccess('Updated successfully');
        setEditingField(null);
      } catch (err) {
        const msg = extractErrorMessage(err, 'Failed to update');
        console.error('[handleFieldSave] Failed:', err);
        showError(msg);
      } finally {
        setSavingField(null);
      }
    };

    const renderInput = () => {
      if (field.jobFieldType === 'BOOLEAN') {
        return (
          <Select
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={isSaving}
            autoFocus
            sx={{ flex: 1, height: '2rem', fontSize: '0.875rem' }}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        );
      }
      if (field.jobFieldType === 'DROPDOWN' && field.options) {
        return (
          <Select
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={isSaving}
            autoFocus
            sx={{ flex: 1, height: '2rem', fontSize: '0.875rem' }}
          >
            {field.options.split(',').map((opt) => (
              <MenuItem key={opt.trim()} value={opt.trim()}>{opt.trim()}</MenuItem>
            ))}
          </Select>
        );
      }
      // NUMBER fields use type="text" rather than the native type="number": a numeric
      // input silently strips leading zeros as you type (e.g. phone numbers like
      // "07598655422" lose the leading 0), since it treats the value as a real number.
      const isNumberField = field.jobFieldType === 'NUMBER';
      return (
        <OutlinedInput
          size="small"
          type={field.jobFieldType === 'DATE' ? 'date' : 'text'}
          inputProps={isNumberField ? { inputMode: 'numeric', pattern: '[0-9.\\-]*' } : undefined}
          value={editValue}
          onChange={(e) => {
            const next = isNumberField ? e.target.value.replace(/[^0-9.-]/g, '') : e.target.value;
            setEditValue(next);
          }}
          disabled={isSaving}
          autoFocus
          sx={{ flex: 1, height: '2rem', fontSize: '0.875rem' }}
        />
      );
    };

    return (
      <S.FieldRow key={fieldKey}>
        <S.FieldIconContainer><LabelIcon /></S.FieldIconContainer>
        <S.FieldLabel>{label}</S.FieldLabel>

        {isEditing ? (
          <S.InlineEditContainer>
            {renderInput()}
            {isSaving ? (
              <CircularProgress size={16} sx={{ ml: 1 }} />
            ) : (
              <Box display="flex">
                <IconButton size="small" onClick={handleFieldSave} color="primary">
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleCancelEdit} color="error">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </S.InlineEditContainer>
        ) : (
          <>
            <S.FieldValue $notSet={notSet}>{notSet ? 'Not set' : displayValue}</S.FieldValue>
            <S.FieldAction>
              <S.ActionButton variant="text" onClick={handleFieldEditClick}>
                {notSet ? 'Add' : 'Edit'}
              </S.ActionButton>
            </S.FieldAction>
          </>
        )}
      </S.FieldRow>
    );
  };

  return (
    <S.SectionContainer>
      <S.SectionHeader>
        <S.SectionTitle>{title}</S.SectionTitle>
      </S.SectionHeader>

      <S.FieldsList>
        {renderEditableRow(<PersonIcon />, 'Customer Name', 'customerName', customer?.name, true)}
        {renderEditableRow(<BusinessIcon />, 'Client Name', 'clientName', client?.name, true)}
        {renderEditableRow(<PhoneIcon />, 'Telephone', 'telephone', contactTelephone, true)}
        {renderEditableRow(<EmailIcon />, 'Email', 'email', contactEmail, true)}
        {renderEditableRow(<PhoneAndroidIcon />, 'Mobile', 'mobile', contactMobile, true)}
        {renderEditableRow(<LocationOnIcon />, 'Address', 'address', contactAddress, true)}

        {editingField === 'address' && (
          <S.MapEditWrapper>
            <S.StyledGoogleMap
              height="15rem"
              center={mapCenter}
              zoom={mapZoom}
              markers={selectedMapAddress ? [selectedMapAddress] : []}
              selectedLocation={selectedMapAddress}
              onLocationSelect={handleLocationSelect}
              confirmBeforeSelect
              showSearchBox={true}
              searchInitialValue={customer?.address?.street || undefined}
            />
            {savingField === 'address' && <CircularProgress size={16} />}
          </S.MapEditWrapper>
        )}

        <S.DividerLine />

        <S.FieldRow>
          <S.FieldIconContainer><FlagIcon /></S.FieldIconContainer>
          <S.FieldLabel>Job Status</S.FieldLabel>

          {editingField === 'status' ? (
            <S.InlineEditContainer>
              <Select
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={savingField === 'status'}
                autoFocus
                sx={{ flex: 1, height: '2rem', fontSize: '0.875rem' }}
              >
                {JOB_STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
              {savingField === 'status' ? (
                <CircularProgress size={16} sx={{ ml: 1 }} />
              ) : (
                <Box display="flex">
                  <IconButton size="small" onClick={() => handleSaveField('status')} color="primary">
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCancelEdit} color="error">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </S.InlineEditContainer>
          ) : (
            <>
              <S.FieldValue>{formatStatus(job.status)}</S.FieldValue>
              <S.FieldAction>
                <S.ActionButton variant="text" onClick={() => handleEditClick('status', job.status || '')}>
                  Edit
                </S.ActionButton>
              </S.FieldAction>
            </>
          )}
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><DescriptionIcon /></S.FieldIconContainer>
          <S.FieldLabel>Template</S.FieldLabel>
          <S.FieldValue>{template?.name || job.templateName || '-'}</S.FieldValue>
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><CategoryIcon /></S.FieldIconContainer>
          <S.FieldLabel>Job No</S.FieldLabel>
          <S.FieldValue>#{job.jobRef ?? job.id}</S.FieldValue>
        </S.FieldRow>

        {renderEditableRow(<PlaceIcon />, 'Site Address', 'siteAddress', formatAddress(job.address))}

        {editingField === 'siteAddress' && (
          <S.MapEditWrapper>
            <S.StyledGoogleMap
              height="15rem"
              center={mapCenter}
              zoom={mapZoom}
              markers={selectedMapAddress ? [selectedMapAddress] : []}
              selectedLocation={selectedMapAddress}
              onLocationSelect={handleLocationSelect}
              confirmBeforeSelect
              showSearchBox={true}
              searchInitialValue={job.address?.street || undefined}
            />
            {savingField === 'siteAddress' && <CircularProgress size={16} />}
          </S.MapEditWrapper>
        )}

        <S.FieldRow>
          <S.FieldIconContainer><InventoryIcon /></S.FieldIconContainer>
          <S.FieldLabel>Assets</S.FieldLabel>
          <S.FieldValue $notSet={!assetNames}>{assetNames || 'Not set'}</S.FieldValue>
          {!assetNames ? (
            <S.FieldAction>
              <S.ActionButton variant="text" onClick={handleAssignAsset}>
                Assign
              </S.ActionButton>
            </S.FieldAction>
          ) : (
            <S.FieldAction>
              <S.ActionButton variant="text" color="error" onClick={handleReturnAsset}>
                Return
              </S.ActionButton>
            </S.FieldAction>
          )}
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><CalendarTodayIcon /></S.FieldIconContainer>
          <S.FieldLabel>Created</S.FieldLabel>
          <S.FieldValue>{formatDate(job.createdAt)}</S.FieldValue>
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><SyncIcon /></S.FieldIconContainer>
          <S.FieldLabel>Updated</S.FieldLabel>
          <S.FieldValue>{formatDate(job.updatedAt)}</S.FieldValue>
        </S.FieldRow>

        {sortedTemplateFields.length > 0 && (
          <>
            <S.DividerLine />
            {sortedTemplateFields.map((field) => renderCustomFieldRow(field))}
          </>
        )}

      </S.FieldsList>
    </S.SectionContainer>
  );
};

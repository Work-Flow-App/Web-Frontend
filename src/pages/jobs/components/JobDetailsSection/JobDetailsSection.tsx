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
import { geocodeAddress } from '../../../../utils/mapDataHelpers';
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

const formatJobAddress = (address?: JobResponse['address']) => {
  if (!address) return '';
  const parts = [address.street, address.city, address.state, address.postalCode, address.country].filter(Boolean);
  return parts.join(', ');
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
  const contactAddress = hasCustomer ? customer?.address?.street : client?.address;
  const canEditContact = !!(customer || client);

  const handleAddressEditClick = async (target: 'address' | 'siteAddress') => {
    setEditingField(target);
    const source = target === 'address' ? customer?.address : job.address;
    const street = source?.street || '';
    setEditValue(street);

    if (street) {
      const loc = await geocodeAddress(street);
      if (loc) {
        setSelectedMapAddress({
          address: street,
          location: loc,
          city: source?.city,
          state: target === 'address' ? customer?.address?.county : job.address?.state,
          postalCode: source?.postalCode,
          country: source?.country,
        });
        setMapCenter(loc);
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
  };

  const handleSaveAddress = async () => {
    const target = editingField as 'address' | 'siteAddress';
    setSavingField(target);
    try {
      if (target === 'address' && customer?.id) {
        const updateReq: CustomerUpdateRequest = {
          name: customer.name || '',
          email: customer.email,
          telephone: customer.telephone,
          mobile: customer.mobile,
          address: {
            street: selectedMapAddress?.address || editValue || '',
            city: selectedMapAddress?.city || customer.address?.city || '',
            county: selectedMapAddress?.state || customer.address?.county || '',
            postalCode: selectedMapAddress?.postalCode || customer.address?.postalCode || '',
            country: selectedMapAddress?.country || customer.address?.country || '',
          },
        };
        const res = await customerService.updateCustomer(customer.id, updateReq);
        onCustomerUpdate?.(res.data);
      } else if (target === 'siteAddress' && job.id) {
        const updateReq: JobUpdateRequest = {
          address: {
            street: selectedMapAddress?.address || editValue || '',
            city: selectedMapAddress?.city || job.address?.city || '',
            state: selectedMapAddress?.state || job.address?.state || '',
            postalCode: selectedMapAddress?.postalCode || job.address?.postalCode || '',
            country: selectedMapAddress?.country || job.address?.country || '',
            additionalInfo: job.address?.additionalInfo,
            latitude: selectedMapAddress?.location?.lat ?? job.address?.latitude,
            longitude: selectedMapAddress?.location?.lng ?? job.address?.longitude,
          },
        };
        const res = await jobService.updateJob(job.id, updateReq);
        onJobUpdate?.(res.data);
      }
      showSuccess('Updated address successfully');
      setEditingField(null);
    } catch {
      showError('Failed to update address');
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
      if (['email', 'telephone', 'mobile', 'address'].includes(field)) {
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
        }
      } else if (field === 'status' && job.id) {
        const updateReq: JobUpdateRequest = { status: editValue as JobUpdateRequest['status'] };
        const res = await jobService.updateJob(job.id, updateReq);
        onJobUpdate?.(res.data);
      }
      showSuccess('Updated successfully');
      setEditingField(null);
    } catch {
      showError('Failed to update');
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
          {allowEdit && !isEditing && (
            <S.FieldAction>
              <S.ActionButton
                variant="text"
                onClick={() => handleAddressEditClick(fieldKey as 'address' | 'siteAddress')}
              >
                {notSet ? 'Add' : 'Edit'}
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
    const fieldValue = job.fieldValues[String(fieldId)];
    if (fieldValue && typeof fieldValue === 'object' && 'value' in fieldValue) {
      return String(fieldValue.value ?? '');
    }
    return fieldValue ? String(fieldValue) : '';
  };

  const getDisplayFieldValue = (field: JobTemplateFieldResponse): string => {
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

    const handleFieldEditClick = () => {
      setEditingField(fieldKey);
      setEditValue(field.jobFieldType === 'DATE' ? toDateInputValue(rawValue) : rawValue);
    };

    const handleFieldSave = async () => {
      setSavingField(fieldKey);
      try {
        if (job.id && field.id !== undefined) {
          const updatedFieldValues: Record<string, unknown> = { ...(job.fieldValues || {}) };
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
      } catch {
        showError('Failed to update');
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
      return (
        <OutlinedInput
          size="small"
          type={field.jobFieldType === 'NUMBER' ? 'number' : field.jobFieldType === 'DATE' ? 'date' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
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
        <S.FieldRow>
          <S.FieldIconContainer><PersonIcon /></S.FieldIconContainer>
          <S.FieldLabel>Customer Name</S.FieldLabel>
          <S.FieldValue $notSet={!customer?.name}>{customer?.name || 'No customer assigned'}</S.FieldValue>
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><BusinessIcon /></S.FieldIconContainer>
          <S.FieldLabel>Client Name</S.FieldLabel>
          <S.FieldValue $notSet={!client?.name}>{client?.name || 'Not set'}</S.FieldValue>
        </S.FieldRow>

        {renderEditableRow(<PhoneIcon />, 'Telephone', 'telephone', contactTelephone, canEditContact)}
        {renderEditableRow(<EmailIcon />, 'Email', 'email', contactEmail, canEditContact)}
        {renderEditableRow(<PhoneAndroidIcon />, 'Mobile', 'mobile', contactMobile, canEditContact)}
        {renderEditableRow(<LocationOnIcon />, 'Address', 'address', contactAddress, canEditContact)}

        {editingField === 'address' && (
          <S.MapEditWrapper>
            <S.StyledGoogleMap
              height="15rem"
              center={mapCenter}
              zoom={mapZoom}
              markers={selectedMapAddress ? [selectedMapAddress] : []}
              selectedLocation={selectedMapAddress}
              onLocationSelect={handleLocationSelect}
              showSearchBox={true}
              searchInitialValue={customer?.address?.street || undefined}
            />
            <S.MapActionButtons>
              <S.MapCancelButton
                variant="outlined"
                size="small"
                onClick={handleCancelEdit}
                disabled={savingField === 'address'}
              >
                Cancel
              </S.MapCancelButton>
              <S.MapSaveButton
                variant="contained"
                size="small"
                onClick={handleSaveAddress}
                disabled={savingField === 'address'}
              >
                {savingField === 'address' ? <CircularProgress size={16} color="inherit" /> : 'Save'}
              </S.MapSaveButton>
            </S.MapActionButtons>
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

        {renderEditableRow(<PlaceIcon />, 'Site Address', 'siteAddress', formatJobAddress(job.address))}

        {editingField === 'siteAddress' && (
          <S.MapEditWrapper>
            <S.StyledGoogleMap
              height="15rem"
              center={mapCenter}
              zoom={mapZoom}
              markers={selectedMapAddress ? [selectedMapAddress] : []}
              selectedLocation={selectedMapAddress}
              onLocationSelect={handleLocationSelect}
              showSearchBox={true}
              searchInitialValue={job.address?.street || undefined}
            />
            <S.MapActionButtons>
              <S.MapCancelButton
                variant="outlined"
                size="small"
                onClick={handleCancelEdit}
                disabled={savingField === 'siteAddress'}
              >
                Cancel
              </S.MapCancelButton>
              <S.MapSaveButton
                variant="contained"
                size="small"
                onClick={handleSaveAddress}
                disabled={savingField === 'siteAddress'}
              >
                {savingField === 'siteAddress' ? <CircularProgress size={16} color="inherit" /> : 'Save'}
              </S.MapSaveButton>
            </S.MapActionButtons>
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

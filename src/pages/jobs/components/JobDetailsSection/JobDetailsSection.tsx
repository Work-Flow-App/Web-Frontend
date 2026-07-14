import React, { useState, useEffect } from 'react';
import { Box, OutlinedInput, IconButton, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory2';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SyncIcon from '@mui/icons-material/Sync';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { customerService, assetService, jobService } from '../../../../services/api';
import type { 
  JobResponse, 
  ClientResponse, 
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
  defaultExpanded?: boolean;
  onJobUpdate?: (updatedJob: JobResponse) => void;
  onCustomerUpdate?: (updatedCustomer: CustomerResponse) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  job,
  client: _client,
  customer,
  template,
  templateFields: _templateFields,
  title: _title,
  defaultExpanded: _defaultExpanded,
  onJobUpdate,
  onCustomerUpdate,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  
  // Available assets for display mapping
  const [allAssets, setAllAssets] = useState<AssetResponse[]>([]);

  // Editing state for specific fields
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [savingField, setSavingField] = useState<string | null>(null);

  // Map editing state
  const [selectedMapAddress, setSelectedMapAddress] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(GOOGLE_MAPS_CONFIG.defaultZoom);

  const handleAddressEditClick = async () => {
    setEditingField('address');
    const street = customer?.address?.street || '';
    setEditValue(street);
    
    if (street) {
      const loc = await geocodeAddress(street);
      if (loc) {
        setSelectedMapAddress({
          address: street,
          location: loc,
          city: customer?.address?.city,
          state: customer?.address?.county,
          postalCode: customer?.address?.postalCode,
          country: customer?.address?.country,
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
    setSavingField('address');
    try {
      if (customer?.id) {
        const updateReq: CustomerUpdateRequest = {
          name: customer.name,
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
      }
      showSuccess('Updated address successfully');
      setEditingField(null);
    } catch (err) {
      showError('Failed to update address');
    } finally {
      setSavingField(null);
    }
  };

  useEffect(() => {
    assetService.getAllAssets(0, 200, false, true)
      .then((res) => {
        const content = (res.data as any).content ?? res.data;
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
            name: customer.name,
            email: field === 'email' ? editValue : customer.email,
            telephone: field === 'telephone' ? editValue : customer.telephone,
            mobile: field === 'mobile' ? editValue : customer.mobile,
            address: customer.address,
          };
          if (field === 'address') {
             updateReq.address = { ...customer.address, street: editValue };
          }
          const res = await customerService.updateCustomer(customer.id, updateReq);
          onCustomerUpdate?.(res.data);
        }
      }
      showSuccess('Updated successfully');
      setEditingField(null);
    } catch (err) {
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
              description="Are you sure you want to return the assigned asset(s)?"
              confirmText="Return Asset"
              cancelText="Cancel"
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
                } catch (err) {
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
    } catch (err) {
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

    if (fieldKey === 'address') {
      return (
        <S.FieldRow>
          <S.FieldIconContainer>{icon}</S.FieldIconContainer>
          <S.FieldLabel>{label}</S.FieldLabel>
          <S.FieldValue $notSet={notSet}>{notSet ? 'Not set' : displayValue}</S.FieldValue>
          {allowEdit && !isEditing && (
            <S.FieldAction>
              <S.ActionButton 
                variant="text" 
                onClick={handleAddressEditClick}
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

  return (
    <S.SectionContainer>
      <S.SectionHeader>
        <S.SectionTitle>Job Details</S.SectionTitle>
      </S.SectionHeader>
      
      <S.FieldsList>
        <S.FieldRow>
          <S.FieldIconContainer><PersonIcon /></S.FieldIconContainer>
          <S.FieldLabel>Customer Name</S.FieldLabel>
          <S.FieldValue $notSet={!customer?.name}>{customer?.name || 'No customer assigned'}</S.FieldValue>
        </S.FieldRow>

        {renderEditableRow(<PhoneIcon />, 'Telephone', 'telephone', customer?.telephone)}
        {renderEditableRow(<EmailIcon />, 'Email', 'email', customer?.email)}
        {renderEditableRow(<PhoneAndroidIcon />, 'Mobile', 'mobile', customer?.mobile)}
        {renderEditableRow(<LocationOnIcon />, 'Address', 'address', customer?.address?.street)}

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
          <S.FieldIconContainer><DescriptionIcon /></S.FieldIconContainer>
          <S.FieldLabel>Template</S.FieldLabel>
          <S.FieldValue>{template?.name || (job as any).templateName || '-'}</S.FieldValue>
        </S.FieldRow>

        <S.FieldRow>
          <S.FieldIconContainer><CategoryIcon /></S.FieldIconContainer>
          <S.FieldLabel>Job ID</S.FieldLabel>
          <S.FieldValue>#{job.id}</S.FieldValue>
        </S.FieldRow>

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

      </S.FieldsList>
    </S.SectionContainer>
  );
};

import React, { useState, useEffect } from 'react';
import {
  IconButton, Collapse, Box, TextField, MenuItem, Select,
  FormControl, Button, CircularProgress, Chip, OutlinedInput,
} from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory2';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap/GoogleMap.types';
import { GOOGLE_MAPS_CONFIG } from '../../../../config/googleMaps';
import type {
  JobResponse,
  JobUpdateRequest,
  ClientResponse,
  CustomerResponse,
  CustomerUpdateRequest,
  JobTemplateResponse,
  JobTemplateFieldResponse,
  AssetResponse,
} from '../../../../services/api';
import { jobService, customerService, assetService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from '../../JobDetailsPage.styles';

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
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatJobAddress = (address?: JobResponse['address']) => {
  if (!address) return '-';
  const parts = [address.street, address.city, address.state, address.postalCode, address.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '-';
};

const toDateInputValue = (value: string): string => {
  if (!value) return '';
  return value.split('T')[0];
};

const JOB_STATUSES = ['NEW', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  job,
  client,
  customer,
  template,
  templateFields,
  title,
  defaultExpanded = true,
  onJobUpdate,
  onCustomerUpdate,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // All available assets (for the multi-select dropdown)
  const [allAssets, setAllAssets] = useState<AssetResponse[]>([]);

  // Contact edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelephone, setEditTelephone] = useState('');
  const [editMobile, setEditMobile] = useState('');

  // Job address edit state
  const [editJobAddress, setEditJobAddress] = useState('');
  const [editJobLat, setEditJobLat] = useState<number | undefined>(undefined);
  const [editJobLng, setEditJobLng] = useState<number | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(GOOGLE_MAPS_CONFIG.defaultZoom);
  const [selectedMapLocation, setSelectedMapLocation] = useState<PlaceDetails | null>(null);

  // Job meta edit state
  const [editStatus, setEditStatus] = useState('');
  const [editAssetIds, setEditAssetIds] = useState<number[]>([]);
  const [editFieldValues, setEditFieldValues] = useState<Record<string, string>>({});

  // Load Google Maps once for the whole component
  const { isLoaded: mapsLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  // Fetch all available assets on mount
  useEffect(() => {
    assetService.getAllAssets(0, 200, false, true)
      .then((res) => {
        const content = (res.data as any).content ?? res.data;
        setAllAssets(Array.isArray(content) ? content : []);
      })
      .catch(() => setAllAssets([]));
  }, []);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const sortedFields = [...templateFields].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

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
    if (!raw) return '-';
    if (field.jobFieldType === 'DATE') return formatDate(raw);
    if (field.jobFieldType === 'BOOLEAN') return raw === 'true' ? 'Yes' : 'No';
    return raw;
  };

  const getAssetName = (id: number): string => {
    const asset = allAssets.find((a) => a.id === id);
    return asset?.name || `Asset #${id}`;
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (customer) {
      setEditName(customer.name || '');
      setEditEmail(customer.email || '');
      setEditTelephone(customer.telephone || '');
      setEditMobile(customer.mobile || '');
    } else if (client) {
      setEditName(client.name || '');
      setEditEmail(client.email || '');
      setEditTelephone(client.telephone || '');
      setEditMobile(client.mobile || '');
    }

    const lat = job.address?.latitude ?? undefined;
    const lng = job.address?.longitude ?? undefined;
    const street = job.address?.street || '';
    setEditJobAddress(street);
    setEditJobLat(lat);
    setEditJobLng(lng);

    if (lat && lng) {
      const loc = { lat, lng };
      setMapCenter(loc);
      setMapZoom(15);
      setSelectedMapLocation({ address: street, location: loc });
    } else {
      setMapCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
      setMapZoom(GOOGLE_MAPS_CONFIG.defaultZoom);
      setSelectedMapLocation(null);
    }

    setEditStatus(job.status || 'NEW');
    setEditAssetIds(job.assetIds ? [...job.assetIds] : []);

    const initial: Record<string, string> = {};
    sortedFields.forEach((f) => {
      const raw = getRawFieldValue(f.id!);
      initial[String(f.id)] = f.jobFieldType === 'DATE' ? toDateInputValue(raw) : raw;
    });
    setEditFieldValues(initial);
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleAddressSelect = (place: PlaceDetails) => {
    setEditJobAddress(place.address);
    setEditJobLat(place.location.lat);
    setEditJobLng(place.location.lng);
    setMapCenter(place.location);
    setMapZoom(15);
    setSelectedMapLocation(place);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (customer?.id) {
        const customerUpdate: CustomerUpdateRequest = {
          name: editName,
          email: editEmail || undefined,
          telephone: editTelephone || undefined,
          mobile: editMobile || undefined,
          address: customer.address,
        };
        const res = await customerService.updateCustomer(customer.id, customerUpdate);
        onCustomerUpdate?.(res.data);
      }

      const updatedFieldValues: Record<string, any> = { ...(job.fieldValues || {}) };
      sortedFields.forEach((f) => {
        if (f.id !== undefined) {
          updatedFieldValues[String(f.id)] = editFieldValues[String(f.id)] ?? '';
        }
      });

      const jobUpdate: JobUpdateRequest = {
        status: editStatus as JobUpdateRequest['status'],
        fieldValues: updatedFieldValues,
        assetIds: editAssetIds,
        address: {
          street: editJobAddress || undefined,
          city: job.address?.city || undefined,
          state: job.address?.state || undefined,
          postalCode: job.address?.postalCode || undefined,
          country: job.address?.country || undefined,
          additionalInfo: job.address?.additionalInfo || undefined,
          latitude: editJobLat,
          longitude: editJobLng,
        },
      };
      const jobRes = await jobService.updateJob(job.id!, jobUpdate);
      onJobUpdate?.(jobRes.data);

      showSuccess('Job details saved successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save:', err);
      showError('Failed to save job details');
    } finally {
      setSaving(false);
    }
  };

  const hasCustomer = !!customer;
  const contactLabel = hasCustomer ? 'Customer Name' : 'Client Name';
  const contactName = hasCustomer ? customer?.name : client?.name;
  const contactEmail = hasCustomer ? customer?.email : client?.email;
  const contactTelephone = hasCustomer ? customer?.telephone : client?.telephone;
  const contactMobile = hasCustomer ? customer?.mobile : client?.mobile;

  const renderTemplateField = (field: JobTemplateFieldResponse) => {
    const fieldKey = String(field.id);
    if (isEditing) {
      if (field.jobFieldType === 'BOOLEAN') {
        return (
          <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
            <Select
              value={editFieldValues[fieldKey] || ''}
              onChange={(e) => setEditFieldValues((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        );
      }
      if (field.jobFieldType === 'DROPDOWN' && field.options) {
        return (
          <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
            <Select
              value={editFieldValues[fieldKey] || ''}
              onChange={(e) => setEditFieldValues((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
            >
              {field.options.split(',').map((opt) => (
                <MenuItem key={opt.trim()} value={opt.trim()}>{opt.trim()}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      return (
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          sx={{ mt: 0.5 }}
          type={field.jobFieldType === 'NUMBER' ? 'number' : field.jobFieldType === 'DATE' ? 'date' : 'text'}
          value={editFieldValues[fieldKey] || ''}
          onChange={(e) => setEditFieldValues((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
          slotProps={field.jobFieldType === 'DATE' ? { inputLabel: { shrink: true } } : undefined}
        />
      );
    }
    return <div className="field-value">{getDisplayFieldValue(field)}</div>;
  };

  return (
    <S.CollapsibleSection>
      <S.CollapsibleSectionHeader onClick={toggleExpanded}>
        <S.CollapsibleSectionTitle>{title}</S.CollapsibleSectionTitle>
        <S.CollapsibleSectionActions>
          {isEditing ? (
            <>
              <Button
                size="small"
                variant="contained"
                startIcon={saving ? <CircularProgress size={12} color="inherit" /> : <SaveIcon fontSize="small" />}
                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                disabled={saving}
                sx={{ fontSize: 12, py: 0.5, px: 1.5 }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CloseIcon fontSize="small" />}
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                disabled={saving}
                sx={{ fontSize: 12, py: 0.5, px: 1.5 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <IconButton size="small" onClick={handleEditClick}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </S.CollapsibleSectionActions>
      </S.CollapsibleSectionHeader>

      <Collapse in={isExpanded}>
        <S.CollapsibleSectionContent>
          <S.FieldGrid>
            {/* ── Left column: Contact info + Address ── */}
            <S.FieldColumn>
              {/* Name */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    {hasCustomer ? <PersonIcon fontSize="small" sx={{ opacity: 0.6 }} /> : <BusinessIcon fontSize="small" sx={{ opacity: 0.6 }} />}
                    {contactLabel}
                  </Box>
                </div>
                {isEditing ? (
                  <TextField size="small" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth variant="outlined" sx={{ mt: 0.5 }} />
                ) : (
                  <div className="field-value">{contactName || '-'}</div>
                )}
              </S.FieldItem>

              {/* Email */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Email
                  </Box>
                </div>
                {isEditing ? (
                  <TextField size="small" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth variant="outlined" sx={{ mt: 0.5 }} />
                ) : (
                  <div className="field-value">{contactEmail || '-'}</div>
                )}
              </S.FieldItem>

              {/* Telephone */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Telephone
                  </Box>
                </div>
                {isEditing ? (
                  <TextField size="small" value={editTelephone} onChange={(e) => setEditTelephone(e.target.value)} fullWidth variant="outlined" sx={{ mt: 0.5 }} />
                ) : (
                  <div className="field-value">{contactTelephone || '-'}</div>
                )}
              </S.FieldItem>

              {/* Mobile */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneAndroidIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Mobile
                  </Box>
                </div>
                {isEditing ? (
                  <TextField size="small" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} fullWidth variant="outlined" sx={{ mt: 0.5 }} />
                ) : (
                  <div className="field-value">{contactMobile || '-'}</div>
                )}
              </S.FieldItem>

              {/* Address */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Address
                  </Box>
                </div>
                {isEditing ? (
                  <Box sx={{ mt: 0.5, height: 280, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    {mapsLoaded ? (
                      <GoogleMap
                        center={mapCenter}
                        zoom={mapZoom}
                        onLocationSelect={handleAddressSelect}
                        selectedLocation={selectedMapLocation}
                        markers={selectedMapLocation ? [selectedMapLocation] : []}
                        showSearchBox={true}
                        searchInitialValue={editJobAddress || undefined}
                        height="280px"
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </Box>
                ) : (
                  <div className="field-value">{formatJobAddress(job.address)}</div>
                )}
              </S.FieldItem>
            </S.FieldColumn>

            {/* ── Right column: Job meta ── */}
            <S.FieldColumn>
              {/* Status */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <CategoryIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Job Status
                  </Box>
                </div>
                {isEditing ? (
                  <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                    <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                      {JOB_STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <div className="field-value">
                    <S.StatusBadge statusType={job.status} style={{ fontSize: 12, padding: '4px 10px' }}>
                      <S.StatusIcon />
                      {job.status || 'N/A'}
                    </S.StatusBadge>
                  </div>
                )}
              </S.FieldItem>

              {/* Template (read-only) */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <DescriptionIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Template
                  </Box>
                </div>
                <div className="field-value">{template?.name || '-'}</div>
              </S.FieldItem>

              {/* Assets */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <InventoryIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Assets
                  </Box>
                </div>
                {isEditing ? (
                  <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                    <Select
                      multiple
                      value={editAssetIds}
                      onChange={(e) => setEditAssetIds(e.target.value as number[])}
                      input={<OutlinedInput />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as number[]).map((id) => (
                            <Chip key={id} label={getAssetName(id)} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {allAssets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id}>
                          {asset.name || `Asset #${asset.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {job.assetIds && job.assetIds.length > 0
                      ? job.assetIds.map((id) => (
                          <Chip key={id} label={getAssetName(id)} size="small" variant="outlined" />
                        ))
                      : <div className="field-value">-</div>
                    }
                  </Box>
                )}
              </S.FieldItem>

              {/* Created (read-only) */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Created
                  </Box>
                </div>
                <div className="field-value">{formatDate(job.createdAt)}</div>
              </S.FieldItem>

              {/* Updated (read-only) */}
              <S.FieldItem>
                <div className="field-label">
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.6 }} />
                    Updated
                  </Box>
                </div>
                <div className="field-value">{formatDate(job.updatedAt)}</div>
              </S.FieldItem>

              {template?.description && (
                <S.FieldItem>
                  <div className="field-label">Description</div>
                  <div className="field-value" style={{ whiteSpace: 'pre-wrap' }}>{template.description}</div>
                </S.FieldItem>
              )}
            </S.FieldColumn>
          </S.FieldGrid>

          {/* ── Template custom fields ── */}
          {sortedFields.length > 0 && (
            <Box sx={{ mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <S.FieldGrid>
                <S.FieldColumn>
                  {sortedFields.filter((_, i) => i % 2 === 0).map((field) => (
                    <S.FieldItem key={field.id}>
                      <div className="field-label">{field.label || field.name}</div>
                      {renderTemplateField(field)}
                    </S.FieldItem>
                  ))}
                </S.FieldColumn>
                <S.FieldColumn>
                  {sortedFields.filter((_, i) => i % 2 === 1).map((field) => (
                    <S.FieldItem key={field.id}>
                      <div className="field-label">{field.label || field.name}</div>
                      {renderTemplateField(field)}
                    </S.FieldItem>
                  ))}
                </S.FieldColumn>
              </S.FieldGrid>
            </Box>
          )}
        </S.CollapsibleSectionContent>
      </Collapse>
    </S.CollapsibleSection>
  );
};

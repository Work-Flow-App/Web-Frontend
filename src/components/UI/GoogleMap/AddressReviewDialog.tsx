import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, useMediaQuery } from '@mui/material';
import type { PlaceDetails, AddressReviewDialogProps } from './GoogleMap.types';
import { formatAddress } from '../../../utils/googleGeocoding';
import {
  ReviewTitle,
  ReviewSubtitle,
  ReviewFieldsGrid,
  ReviewFieldLabel,
  ReviewFieldInput,
} from './AddressReviewDialog.styles';

interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const EMPTY_VALUES: AddressFormValues = { street: '', city: '', state: '', postalCode: '', country: '' };

const toFormValues = (place: PlaceDetails | null): AddressFormValues => ({
  street: place?.streetLine || place?.address || '',
  city: place?.city || '',
  state: place?.state || '',
  postalCode: place?.postalCode || '',
  country: place?.country || '',
});

/**
 * Confirmation step shown before any address pick (search suggestion, manual/pasted
 * text, or a map click) is reported back to the caller — see GoogleMap's
 * `confirmBeforeSelect` prop, which is what opens this. Purely controlled: it never
 * calls anything itself, it just hands the edited structured address back on confirm.
 */
const AddressReviewDialog: React.FC<AddressReviewDialogProps> = ({ open, initialValue, onConfirm, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [values, setValues] = useState<AddressFormValues>(EMPTY_VALUES);

  // Reseed the editable fields every time the dialog opens with a new pick — this is a
  // review step for whatever was just selected, not a persistent form.
  useEffect(() => {
    if (open) setValues(toFormValues(initialValue));
  }, [open, initialValue]);

  const handleChange = (field: keyof AddressFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canConfirm = values.street.trim().length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    const composedAddress = formatAddress(values);
    onConfirm({
      ...(initialValue ?? { location: { lat: 0, lng: 0 } }),
      address: composedAddress || values.street,
      streetLine: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: isMobile
            ? { position: 'fixed', bottom: 0, m: 0, width: '100%', maxWidth: '100%', borderRadius: '1rem 1rem 0 0' }
            : { borderRadius: '0.75rem' },
        },
      }}
    >
      <DialogTitle>
        <ReviewTitle variant="h6">Review Address</ReviewTitle>
        <ReviewSubtitle variant="body2">Please confirm or edit the location details before saving.</ReviewSubtitle>
      </DialogTitle>
      <DialogContent>
        <ReviewFieldsGrid>
          <div>
            <ReviewFieldLabel>Street Address</ReviewFieldLabel>
            <ReviewFieldInput value={values.street} onChange={handleChange('street')} autoFocus fullWidth />
          </div>
          <div>
            <ReviewFieldLabel>City</ReviewFieldLabel>
            <ReviewFieldInput value={values.city} onChange={handleChange('city')} fullWidth />
          </div>
          <div>
            <ReviewFieldLabel>State/Region</ReviewFieldLabel>
            <ReviewFieldInput value={values.state} onChange={handleChange('state')} fullWidth />
          </div>
          <div>
            <ReviewFieldLabel>Postal Code</ReviewFieldLabel>
            <ReviewFieldInput value={values.postalCode} onChange={handleChange('postalCode')} fullWidth />
          </div>
          <div>
            <ReviewFieldLabel>Country</ReviewFieldLabel>
            <ReviewFieldInput value={values.country} onChange={handleChange('country')} fullWidth />
          </div>
        </ReviewFieldsGrid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!canConfirm}>Confirm &amp; Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressReviewDialog;

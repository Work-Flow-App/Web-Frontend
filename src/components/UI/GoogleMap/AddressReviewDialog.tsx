import React, { useEffect, useState } from 'react';
import type { PlaceDetails, AddressReviewDialogProps } from './GoogleMap.types';
import { formatAddress } from '../../../utils/googleGeocoding';
import { Button } from '../Button';
import {
  ModalContentWrapper,
  ModalHeaderWrapper,
  ModalHeaderContent,
  ModalTitle,
  ModalSubtitle,
  ModalBody,
  ModalFooterWrapper,
} from '../GlobalModal/GlobalModal.styled';
import { StyledDialog, ReviewFieldsGrid, ReviewFieldLabel, ReviewFieldInput } from './AddressReviewDialog.styles';

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
 *
 * Built from the same header/body/footer chrome and Button component as the app's
 * GlobalModal, so it reads as the same "family" of modal instead of a one-off — it just
 * can't actually render through GlobalModal itself, since GlobalModal is a single global
 * slot and this dialog frequently needs to stack on top of one that's already open (e.g.
 * picking a location inside the Add Job Wizard).
 */
const AddressReviewDialog: React.FC<AddressReviewDialogProps> = ({ open, initialValue, onConfirm, onCancel }) => {
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
    const fallbackLocation = initialValue ?? { location: { lat: 0, lng: 0 }, isManualAddressOnly: true };
    onConfirm({
      ...fallbackLocation,
      address: composedAddress || values.street,
      streetLine: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
    });
  };

  return (
    <StyledDialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <ModalContentWrapper>
        <ModalHeaderWrapper>
          <ModalHeaderContent>
            <ModalTitle>Review Address</ModalTitle>
            <ModalSubtitle>Please confirm or edit the location details before saving.</ModalSubtitle>
          </ModalHeaderContent>
        </ModalHeaderWrapper>
        <ModalBody>
          <ReviewFieldsGrid>
            <div>
              <ReviewFieldLabel>Street Address</ReviewFieldLabel>
              <ReviewFieldInput value={values.street} onChange={handleChange('street')} autoFocus fullWidth aria-label="Street Address" />
            </div>
            <div>
              <ReviewFieldLabel>City</ReviewFieldLabel>
              <ReviewFieldInput value={values.city} onChange={handleChange('city')} fullWidth aria-label="City" />
            </div>
            <div>
              <ReviewFieldLabel>State/Region</ReviewFieldLabel>
              <ReviewFieldInput value={values.state} onChange={handleChange('state')} fullWidth aria-label="State/Region" />
            </div>
            <div>
              <ReviewFieldLabel>Postal Code</ReviewFieldLabel>
              <ReviewFieldInput value={values.postalCode} onChange={handleChange('postalCode')} fullWidth aria-label="Postal Code" />
            </div>
            <div>
              <ReviewFieldLabel>Country</ReviewFieldLabel>
              <ReviewFieldInput value={values.country} onChange={handleChange('country')} fullWidth aria-label="Country" />
            </div>
          </ReviewFieldsGrid>
        </ModalBody>
        <ModalFooterWrapper>
          <Button size="small" variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleConfirm} disabled={!canConfirm}>
            Confirm &amp; Save
          </Button>
        </ModalFooterWrapper>
      </ModalContentWrapper>
    </StyledDialog>
  );
};

export default AddressReviewDialog;

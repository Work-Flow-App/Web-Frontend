import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, FormHelperText, Typography } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../config/googleMaps';
import { parseAddressFieldValue, type StructuredAddressFieldValue } from '../../../../utils/customAddressField';
import { formatAddress } from '../../../../utils/googleGeocoding';
import { MapWrapper } from './LocationMapField.styles';

export interface CustomAddressFieldProps {
  fieldId: number;
  error?: string;
}

const toPlaceDetails = (value: StructuredAddressFieldValue | null): PlaceDetails | null => {
  if (!value || value.latitude == null || value.longitude == null) return null;
  return {
    address: formatAddress(value),
    streetLine: value.street,
    city: value.city,
    state: value.state,
    postalCode: value.postalCode,
    country: value.country,
    location: { lat: value.latitude, lng: value.longitude },
  };
};

/**
 * Address-type job template custom field. Unlike LocationMapField (which spreads a fixed
 * address across 6 sibling RHF fields), a custom field has exactly one slot in the job's
 * fieldValues map — so this stores the whole structured address as a single object under
 * `field_<fieldId>`.
 */
const CustomAddressField: React.FC<CustomAddressFieldProps> = ({ fieldId, error }) => {
  const fieldName = `field_${fieldId}`;
  const { setValue, watch } = useFormContext();
  const rawValue = watch(fieldName);

  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(() =>
    toPlaceDetails(parseAddressFieldValue(rawValue))
  );
  const [mapCenter, setMapCenter] = useState(selectedLocation?.location ?? GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(selectedLocation ? 15 : GOOGLE_MAPS_CONFIG.defaultZoom);
  // True for exactly one render cycle right after handleLocationSelect's own setValue call —
  // lets the resync effect below tell "I caused this rawValue change myself" apart from a
  // genuinely external one (e.g. RHF's defaultValues resolving async after mount), WITHOUT
  // relying on object-reference equality across react-hook-form's setValue — RHF deep-clones
  // the value before storing it, so watch() never echoes back the exact object we pass in,
  // which is why a syncedValueRef-based identity check can never work here.
  const selfWriteRef = useRef(false);

  // The whole job form's defaultValues can resolve asynchronously after this component
  // has already mounted (e.g. editing an existing job) — re-sync the pin once that lands.
  // Skip this effect if it's a self-caused change from handleLocationSelect.
  useEffect(() => {
    if (selfWriteRef.current) {
      selfWriteRef.current = false;
      return;
    }
    const place = toPlaceDetails(parseAddressFieldValue(rawValue));
    if (place) {
      setSelectedLocation(place);
      setMapCenter(place.location);
      setMapZoom(15);
    } else {
      setSelectedLocation(null);
      setMapCenter(GOOGLE_MAPS_CONFIG.defaultCenter);
      setMapZoom(GOOGLE_MAPS_CONFIG.defaultZoom);
    }
  }, [rawValue]);

  const handleLocationSelect = (place: PlaceDetails) => {
    const value: StructuredAddressFieldValue = {
      street: place.streetLine || place.address || '',
      city: place.city || '',
      state: place.state || '',
      postalCode: place.postalCode || '',
      country: place.country || '',
      latitude: place.isManualAddressOnly ? null : place.location?.lat ?? null,
      longitude: place.isManualAddressOnly ? null : place.location?.lng ?? null,
    };

    if (place.isManualAddressOnly) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(place);
      setMapCenter(place.location);
      setMapZoom(15);
    }

    // Mark this as a self-caused write so the resync effect knows not to override the
    // map-position decision we just deliberately made.
    selfWriteRef.current = true;
    setValue(fieldName, value, { shouldDirty: true });
  };

  if (!isGoogleMapsConfigured()) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          Google Maps API key not configured.
        </Typography>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <MapWrapper>
        <GoogleMap
          center={mapCenter}
          zoom={mapZoom}
          markers={selectedLocation ? [selectedLocation] : []}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          confirmBeforeSelect
          showSearchBox
          searchInitialValue={selectedLocation?.streetLine}
          height="300px"
        />
      </MapWrapper>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

export default CustomAddressField;

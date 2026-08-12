import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../config/googleMaps';
import { parseAddressFieldValue, type StructuredAddressFieldValue } from '../../../../utils/customAddressField';
import { formatAddress } from '../../../../utils/googleGeocoding';
import { MapWrapper } from './LocationMapField.styles';

export interface CustomAddressFieldProps {
  fieldId: number;
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
const CustomAddressField: React.FC<CustomAddressFieldProps> = ({ fieldId }) => {
  const fieldName = `field_${fieldId}`;
  const { setValue, watch } = useFormContext();
  const rawValue = watch(fieldName);

  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(() =>
    toPlaceDetails(parseAddressFieldValue(rawValue))
  );
  const [mapCenter, setMapCenter] = useState(selectedLocation?.location ?? GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(selectedLocation ? 15 : GOOGLE_MAPS_CONFIG.defaultZoom);
  const syncedValueRef = useRef(rawValue);

  // The whole job form's defaultValues can resolve asynchronously after this component
  // has already mounted (e.g. editing an existing job) — re-sync the pin once that lands.
  useEffect(() => {
    if (rawValue === syncedValueRef.current) return;
    syncedValueRef.current = rawValue;
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

    setValue(fieldName, value, { shouldDirty: true });
  };

  if (!isGoogleMapsConfigured()) {
    return (
      <Typography variant="body2" color="text.secondary">
        Google Maps API key not configured.
      </Typography>
    );
  }

  return (
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
  );
};

export default CustomAddressField;

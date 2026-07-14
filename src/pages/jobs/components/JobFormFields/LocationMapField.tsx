import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useJsApiLoader } from '@react-google-maps/api';
import { Typography } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../config/googleMaps';
import { MapWrapper } from './LocationMapField.styles';

export interface LocationMapFieldProps {
  /** Prefix for the bound field names, e.g. 'address' -> addressStreet, addressCity, ... */
  namePrefix?: string;
}

const LocationMapField: React.FC<LocationMapFieldProps> = ({ namePrefix = 'address' }) => {
  const streetField = `${namePrefix}Street`;
  const cityField = `${namePrefix}City`;
  const stateField = `${namePrefix}State`;
  const postalCodeField = `${namePrefix}PostalCode`;
  const countryField = `${namePrefix}Country`;
  const latitudeField = `${namePrefix}Latitude`;
  const longitudeField = `${namePrefix}Longitude`;

  const { setValue, watch } = useFormContext();
  const addressStreet = watch(streetField) as string;
  const savedLat = watch(latitudeField) as number | null | undefined;
  const savedLng = watch(longitudeField) as number | null | undefined;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(GOOGLE_MAPS_CONFIG.defaultZoom);
  const geocodedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (savedLat != null && savedLng != null && addressStreet) {
      const location = { lat: savedLat, lng: savedLng };
      setSelectedLocation({ address: addressStreet, location });
      setMapCenter(location);
      setMapZoom(15);
      return;
    }

    if (!addressStreet || geocodedRef.current) return;
    geocodedRef.current = true;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressStreet }, (results, status) => {
      if (status === 'OK' && results?.[0]?.geometry?.location) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setSelectedLocation({ address: addressStreet, location });
        setMapCenter(location);
        setMapZoom(15);
        setValue(latitudeField, location.lat, { shouldDirty: true });
        setValue(longitudeField, location.lng, { shouldDirty: true });
      }
    });
  }, [isLoaded, addressStreet, savedLat, savedLng, setValue, latitudeField, longitudeField]);

  const handleLocationSelect = (place: PlaceDetails) => {
    setValue(streetField, place.address, { shouldDirty: true });
    setValue(cityField, place.city ?? '', { shouldDirty: true });
    setValue(stateField, place.state ?? '', { shouldDirty: true });
    setValue(postalCodeField, place.postalCode ?? '', { shouldDirty: true });
    setValue(countryField, place.country ?? '', { shouldDirty: true });

    if (place.isManualAddressOnly) {
      setSelectedLocation(null);
      setValue(latitudeField, null, { shouldDirty: true });
      setValue(longitudeField, null, { shouldDirty: true });
      return;
    }

    setSelectedLocation(place);
    setMapCenter(place.location);
    setMapZoom(15);
    setValue(latitudeField, place.location.lat, { shouldDirty: true });
    setValue(longitudeField, place.location.lng, { shouldDirty: true });
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
        showSearchBox
        searchInitialValue={addressStreet || undefined}
        height="300px"
      />
    </MapWrapper>
  );
};

export default LocationMapField;

import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useJsApiLoader } from '@react-google-maps/api';
import { Typography } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../config/googleMaps';
import { MapWrapper } from './LocationMapField.styles';

const LocationMapField: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const addressStreet = watch('addressStreet') as string;
  const savedLat = watch('addressLatitude') as number | null | undefined;
  const savedLng = watch('addressLongitude') as number | null | undefined;

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
        setValue('addressLatitude', location.lat, { shouldDirty: true });
        setValue('addressLongitude', location.lng, { shouldDirty: true });
      }
    });
  }, [isLoaded, addressStreet, savedLat, savedLng, setValue]);

  const handleLocationSelect = (place: PlaceDetails) => {
    setValue('addressStreet', place.address, { shouldDirty: true });
    setValue('addressCity', place.city ?? '', { shouldDirty: true });
    setValue('addressState', place.state ?? '', { shouldDirty: true });
    setValue('addressPostalCode', place.postalCode ?? '', { shouldDirty: true });
    setValue('addressCountry', place.country ?? '', { shouldDirty: true });

    if (place.isManualAddressOnly) {
      setSelectedLocation(null);
      setValue('addressLatitude', null, { shouldDirty: true });
      setValue('addressLongitude', null, { shouldDirty: true });
      return;
    }

    setSelectedLocation(place);
    setMapCenter(place.location);
    setMapZoom(15);
    setValue('addressLatitude', place.location.lat, { shouldDirty: true });
    setValue('addressLongitude', place.location.lng, { shouldDirty: true });
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

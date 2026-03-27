import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../config/googleMaps';

/**
 * LocationMapField
 * Plugs into react-hook-form via useFormContext.
 * - Edit mode: reads addressStreet, geocodes it, shows an existing pin.
 * - Create / edit: user can search and select a new location via the map.
 * - On selection, writes the formatted address back to addressStreet.
 */
const LocationMapField: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const addressStreet = watch('addressStreet') as string;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(null);
  const [mapCenter, setMapCenter] = useState(GOOGLE_MAPS_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState(GOOGLE_MAPS_CONFIG.defaultZoom);
  const geocodedRef = useRef(false);

  // Geocode existing address once when the API loads (edit mode)
  useEffect(() => {
    if (!isLoaded || !addressStreet || geocodedRef.current) return;
    geocodedRef.current = true;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressStreet }, (results, status) => {
      if (status === 'OK' && results?.[0]?.geometry?.location) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        const pin: PlaceDetails = { address: addressStreet, location };
        setSelectedLocation(pin);
        setMapCenter(location);
        setMapZoom(15);
      }
    });
  }, [isLoaded, addressStreet]);

  const handleLocationSelect = (place: PlaceDetails) => {
    setSelectedLocation(place);
    setMapCenter(place.location);
    setMapZoom(15);
    // Write selected address into form — clear the split fields
    setValue('addressStreet', place.address, { shouldDirty: true });
    setValue('addressCity', '');
    setValue('addressState', '');
    setValue('addressPostalCode', '');
    setValue('addressCountry', '');
  };

  if (!isGoogleMapsConfigured()) {
    return (
      <Typography variant="body2" color="text.secondary">
        Google Maps API key not configured.
      </Typography>
    );
  }

  return (
    <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
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
    </Box>
  );
};

export default LocationMapField;

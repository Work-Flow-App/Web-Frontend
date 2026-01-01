import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationSearch from '../../LeafletMap/LocationSearch';
import type { PlaceDetails } from '../../LeafletMap/LeafletMap.types';
import { NOMINATIM_CONFIG } from '../../../../config/googleMaps';

export interface LocationInputProps {
  /** Name prefix for the location fields (e.g., 'currentLocation') */
  namePrefix?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Whether to show the geolocation button */
  showGeolocation?: boolean;
}

/**
 * LocationInput Component
 * Combines LocationSearch with browser geolocation and react-hook-form integration
 *
 * Features:
 * - Location search with Nominatim (OpenStreetMap) - 100% FREE
 * - Auto-detect location using browser geolocation
 * - Integrates with react-hook-form
 * - Automatically updates latitude and longitude fields
 */
export const LocationInput: React.FC<LocationInputProps> = ({
  namePrefix = 'currentLocation',
  placeholder = 'Search for a location...',
  showGeolocation = true,
}) => {
  const { setValue, watch } = useFormContext();
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchKey, setSearchKey] = useState(0);

  // Watch the current location value to reset search when cleared
  const currentLocationValue = watch(namePrefix);

  // Handle location selection from search
  const handlePlaceSelect = useCallback(
    (place: PlaceDetails) => {
      // Update form values
      setValue(namePrefix, place.address, { shouldValidate: true, shouldDirty: true });
      setValue('latitude', place.location.lat, { shouldValidate: true, shouldDirty: true });
      setValue('longitude', place.location.lng, { shouldValidate: true, shouldDirty: true });

      // Force re-render of search component to show selected value
      setSearchKey(prev => prev + 1);
    },
    [setValue, namePrefix]
  );

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
      });

      const response = await fetch(`${NOMINATIM_CONFIG.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': 'WorkFlow App',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }

    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Handle browser geolocation
  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Get address from coordinates
        const address = await reverseGeocode(latitude, longitude);

        // Update form values
        setValue(namePrefix, address);
        setValue('latitude', latitude);
        setValue('longitude', longitude);

        setIsDetecting(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        alert(errorMessage);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [setValue, namePrefix]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <LocationSearch
            key={searchKey}
            onPlaceSelect={handlePlaceSelect}
            placeholder={placeholder}
            currentValue={currentLocationValue}
          />
        </Box>

        {showGeolocation && (
          <Tooltip title="Detect my location">
            <IconButton
              onClick={handleGeolocation}
              disabled={isDetecting}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                },
              }}
              size="medium"
            >
              {isDetecting ? <CircularProgress size={24} color="inherit" /> : <MyLocationIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Hidden input to register with react-hook-form */}
      <input type="hidden" name={namePrefix} />
    </Box>
  );
};

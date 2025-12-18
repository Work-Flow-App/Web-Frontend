import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { NOMINATIM_CONFIG } from '../../../config/googleMaps';
import type { LocationSearchProps, PlaceDetails, NominatimSearchResult } from './LeafletMap.types';

/**
 * LocationSearch Component
 * Provides a search input with Nominatim (OpenStreetMap) geocoding
 * 100% FREE - No API key required
 */
const LocationSearch: React.FC<LocationSearchProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
  defaultValue = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [options, setOptions] = useState<NominatimSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch location suggestions from Nominatim API
  const fetchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const params: Record<string, string> = {
        q: query,
        format: NOMINATIM_CONFIG.searchParams.format,
        addressdetails: NOMINATIM_CONFIG.searchParams.addressdetails.toString(),
        limit: NOMINATIM_CONFIG.searchParams.limit.toString(),
      };

      const searchParams = new URLSearchParams(params);

      const response = await fetch(`${NOMINATIM_CONFIG.baseUrl}/search?${searchParams}`, {
        headers: {
          'User-Agent': 'WorkFlow App', // Nominatim requires a User-Agent header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: NominatimSearchResult[] = await response.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue) {
        fetchLocations(inputValue);
      }
    }, 500); // 500ms debounce to be respectful to Nominatim

    return () => clearTimeout(timeoutId);
  }, [inputValue, fetchLocations]);

  // Handle selection
  const handleSelect = (result: NominatimSearchResult | null) => {
    if (!result) return;

    const placeDetails: PlaceDetails = {
      name: result.address?.city || result.address?.town || result.address?.village || '',
      address: result.display_name,
      location: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      placeId: result.place_id.toString(),
    };

    onPlaceSelect(placeDetails);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.display_name;
      }}
      filterOptions={(x) => x} // Disable built-in filtering
      loading={loading}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_event, value) => {
        if (value && typeof value !== 'string') {
          handleSelect(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.place_id}>
          <div>
            <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
              {option.address?.city || option.address?.town || option.address?.village || 'Location'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>{option.display_name}</div>
          </div>
        </li>
      )}
    />
  );
};

export default LocationSearch;

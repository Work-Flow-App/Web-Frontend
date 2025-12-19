import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { PlacesAutocompleteProps, PlaceDetails } from './GoogleMap.types';

/**
 * PlacesAutocomplete Component
 * Provides a search input with Google Places autocomplete functionality
 */
const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
  defaultValue = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize services when Google Maps API is loaded
  useEffect(() => {
    // Wait for Google Maps API to be fully loaded
    const initializeServices = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        // API not loaded yet, retry after a short delay
        setTimeout(initializeServices, 100);
        return;
      }

      autocompleteService.current = new window.google.maps.places.AutocompleteService();

      // Create a dummy div for PlacesService (it requires a map or div)
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    };

    initializeServices();
  }, []);

  // Fetch place predictions based on input
  const fetchPredictions = async (input: string) => {
    if (!input || !autocompleteService.current) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const result = await autocompleteService.current.getPlacePredictions({
        input,
        componentRestrictions: { country: 'bd' }, // Restrict to Bangladesh, change as needed
      });

      setOptions(result?.predictions || []);
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Get place details when a prediction is selected
  const getPlaceDetails = (placeId: string) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'place_id'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const placeDetails: PlaceDetails = {
            name: place.name || '',
            address: place.formatted_address || '',
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
            placeId: place.place_id,
          };
          onPlaceSelect(placeDetails);
        }
      }
    );
  };

  // Debounce input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue) {
        fetchPredictions(inputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.description;
      }}
      filterOptions={(x) => x} // Disable built-in filtering
      loading={loading}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(_event, value) => {
        if (value && typeof value !== 'string') {
          getPlaceDetails(value.place_id);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
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
    />
  );
};

export default PlacesAutocomplete;

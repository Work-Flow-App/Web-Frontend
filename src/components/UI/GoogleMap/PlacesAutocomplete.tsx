import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography, Box } from '@mui/material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import type { PlacesAutocompleteProps } from './GoogleMap.types';

const MANUAL_VALUE = '__manual__';

interface LocationOption {
  value: string;
  label: string;
  isManual?: boolean;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
  defaultValue,
}) => {
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const cache = useRef<Map<string, google.maps.places.AutocompletePrediction[]>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inputValue, setInputValue] = useState(defaultValue ?? '');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(
    defaultValue ? { value: '__preset__', label: defaultValue } : null
  );

  useEffect(() => {
    if (window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const div = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(div);
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  const lazyInit = useCallback(() => {
    if (!autocompleteService.current && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const div = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(div);
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  const buildOptions = useCallback(
    (predictions: google.maps.places.AutocompletePrediction[], query: string): LocationOption[] => {
      const opts: LocationOption[] = predictions.map((p) => ({ value: p.place_id, label: p.description }));
      if (query.length >= 2) {
        opts.push({ value: MANUAL_VALUE, label: query, isManual: true });
      }
      return opts;
    },
    []
  );

  const fetchPredictions = useCallback(
    (query: string) => {
      if (!query || query.length < 2) {
        setOptions([]);
        setLoading(false);
        return;
      }

      lazyInit();

      if (cache.current.has(query)) {
        setOptions(buildOptions(cache.current.get(query)!, query));
        setLoading(false);
        return;
      }

      setLoading(true);
      autocompleteService.current?.getPlacePredictions({ input: query }, (predictions, status) => {
        const preds = status === 'OK' && predictions ? predictions : [];
        cache.current.set(query, preds);
        setOptions(buildOptions(preds, query));
        setLoading(false);
      });
    },
    [lazyInit, buildOptions]
  );

  const handleInputChange = useCallback(
    (_: React.SyntheticEvent, newInput: string) => {
      setInputValue(newInput);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (!newInput || newInput.length < 2) {
        setOptions([]);
        return;
      }
      debounceTimer.current = setTimeout(() => fetchPredictions(newInput), 300);
    },
    [fetchPredictions]
  );

  const handleChange = useCallback(
    (_: React.SyntheticEvent, option: LocationOption | null) => {
      setSelectedOption(option);
      if (!option) return;

      if (option.isManual) {
        lazyInit();
        const doGeocode = (geo: google.maps.Geocoder) => {
          geo.geocode({ address: option.label }, (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              onPlaceSelect({
                address: results[0].formatted_address || option.label,
                location: { lat: loc.lat(), lng: loc.lng() },
                placeId: results[0].place_id,
              });
            } else {
              // Geocoder failed — pass address only; user can click map to pin
              onPlaceSelect({
                address: option.label,
                location: { lat: 0, lng: 0 },
                isManualAddressOnly: true,
              });
            }
          });
        };

        if (geocoderRef.current) {
          doGeocode(geocoderRef.current);
        } else if (window.google?.maps) {
          geocoderRef.current = new window.google.maps.Geocoder();
          doGeocode(geocoderRef.current);
        } else {
          onPlaceSelect({ address: option.label, location: { lat: 0, lng: 0 }, isManualAddressOnly: true });
        }
        return;
      }

      if (!placesService.current) return;
      placesService.current.getDetails(
        { placeId: option.value, fields: ['name', 'formatted_address', 'geometry', 'place_id'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            onPlaceSelect({
              name: place.name ?? '',
              address: place.formatted_address ?? '',
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
              placeId: place.place_id,
            });
          }
        }
      );
    },
    [onPlaceSelect, lazyInit]
  );

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      filterOptions={(x) => x}
      inputValue={inputValue}
      value={selectedOption}
      onInputChange={handleInputChange}
      onChange={handleChange}
      loading={loading}
      noOptionsText={
        inputValue.length < 2
          ? 'Type at least 2 characters to search…'
          : 'No suggestions found — try "Enter manually" below'
      }
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      disablePortal
      fullWidth
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        if (option.isManual) {
          return (
            <li key={key} {...rest}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25 }}>
                <EditLocationAltIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', lineHeight: 1.3 }}>
                    Enter manually
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                    "{option.label}"
                  </Typography>
                </Box>
              </Box>
            </li>
          );
        }
        return (
          <li key={key} {...rest}>
            <Typography variant="body2">{option.label}</Typography>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={12} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            autoComplete: 'new-password',
          }}
        />
      )}
    />
  );
};

export default PlacesAutocomplete;

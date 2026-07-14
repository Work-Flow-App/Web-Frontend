import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { PlacesAutocompleteProps, LocationOption} from './PlacesAutocomplete.types';
import {
  ManualOptionWrapper,
  ManualOptionTextBox,
  ManualOptionIcon,
  ManualOptionTitle,
  ManualOptionSubtitle,
  RegularOptionText,
} from './PlacesAutocomplete.styles';
import {
  MANUAL_VALUE,
  DEBOUNCE_DELAY_MS,
  MIN_SEARCH_LENGTH,
  PLACE_DETAIL_FIELDS,
  getNoOptionsText,
  extractAddressComponents,
} from './PlacesAutocompleteConst';

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
      if (query.length >= MIN_SEARCH_LENGTH) {
        opts.push({ value: MANUAL_VALUE, label: query, isManual: true });
      }
      return opts;
    },
    []
  );

  const fetchPredictions = useCallback(
    (query: string) => {
      if (!query || query.length < MIN_SEARCH_LENGTH) {
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
      if (!newInput || newInput.length < MIN_SEARCH_LENGTH) {
        setOptions([]);
        return;
      }
      debounceTimer.current = setTimeout(() => fetchPredictions(newInput), DEBOUNCE_DELAY_MS);
    },
    [fetchPredictions]
  );

  // Places Details / forward geocoding often omit the postal_code component for
  // POI results or lower-precision matches, even though city/country resolve fine.
  // A reverse geocode by coordinates tends to return a more granular breakdown,
  // so use it to backfill postalCode when the primary lookup came back empty.
  const withPostalCodeFallback = useCallback(
    (
      location: { lat: number; lng: number },
      components: ReturnType<typeof extractAddressComponents>,
      callback: (finalComponents: ReturnType<typeof extractAddressComponents>) => void
    ) => {
      if (components.postalCode || !geocoderRef.current) {
        callback(components);
        return;
      }
      geocoderRef.current.geocode({ location }, (results, status) => {
        const fallbackPostalCode =
          status === 'OK' && results?.[0] ? extractAddressComponents(results[0].address_components).postalCode : '';
        callback({ ...components, postalCode: fallbackPostalCode || components.postalCode });
      });
    },
    []
  );

  const handleChange = useCallback(
    (_: React.SyntheticEvent, option: LocationOption | null) => {
      setSelectedOption(option);
      if (!option) return;

      lazyInit();

      if (option.isManual) {
        const doGeocode = (geo: google.maps.Geocoder) => {
          geo.geocode({ address: option.label }, (results, status) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              const location = { lat: loc.lat(), lng: loc.lng() };
              const components = extractAddressComponents(results[0].address_components);
              withPostalCodeFallback(location, components, (finalComponents) => {
                onPlaceSelect({
                  address: results[0].formatted_address || option.label,
                  location,
                  placeId: results[0].place_id,
                  ...finalComponents,
                });
              });
            } else {
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
        { placeId: option.value, fields: [...PLACE_DETAIL_FIELDS] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            const components = extractAddressComponents(place.address_components);
            withPostalCodeFallback(location, components, (finalComponents) => {
              onPlaceSelect({
                name: place.name ?? '',
                address: place.formatted_address ?? '',
                location,
                placeId: place.place_id,
                ...finalComponents,
              });
            });
          }
        }
      );
    },
    [onPlaceSelect, lazyInit, withPostalCodeFallback]
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
      noOptionsText={getNoOptionsText(inputValue)}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      disablePortal
      fullWidth
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        if (option.isManual) {
          return (
            <li key={key} {...rest}>
              <ManualOptionWrapper>
                <ManualOptionIcon />
                <ManualOptionTextBox>
                  <ManualOptionTitle variant="body2">Enter manually</ManualOptionTitle>
                  <ManualOptionSubtitle variant="caption">"{option.label}"</ManualOptionSubtitle>
                </ManualOptionTextBox>
              </ManualOptionWrapper>
            </li>
          );
        }
        return (
          <li key={key} {...rest}>
            <RegularOptionText variant="body2">{option.label}</RegularOptionText>
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
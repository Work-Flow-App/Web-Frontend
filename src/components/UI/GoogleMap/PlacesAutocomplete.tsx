import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { PlacesAutocompleteProps, LocationOption } from './PlacesAutocomplete.types';
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
} from './PlacesAutocompleteConst';
import {
  getAutocompleteService,
  getPlacesService,
  createAutocompleteSessionToken,
  extractAddressComponents,
  geocodeAddress,
  reverseGeocode,
} from '../../../utils/googleGeocoding';

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
  defaultValue,
}) => {
  const cache = useRef<Map<string, google.maps.places.AutocompletePrediction[]>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Shared across one "type -> select" sequence so predictions + the details
  // call bill together at Google's cheaper session rate. Reset after every
  // commit so the next search starts a fresh session.
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | undefined>(undefined);

  const [inputValue, setInputValue] = useState(defaultValue ?? '');
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(
    defaultValue ? { value: '__preset__', label: defaultValue } : null
  );

  // `defaultValue` (searchInitialValue) can legitimately change after this
  // component has already mounted — e.g. a parent form pre-fills the address
  // from an async fetch that resolves after the map/search box first render.
  // Without this, the search box silently keeps showing blank/stale text.
  const lastSyncedDefault = useRef(defaultValue);
  useEffect(() => {
    if (defaultValue === lastSyncedDefault.current) return;
    lastSyncedDefault.current = defaultValue;
    setInputValue(defaultValue ?? '');
    setSelectedOption(defaultValue ? { value: '__preset__', label: defaultValue } : null);
  }, [defaultValue]);

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

      if (cache.current.has(query)) {
        setOptions(buildOptions(cache.current.get(query)!, query));
        setLoading(false);
        return;
      }

      const autocompleteService = getAutocompleteService();
      if (!autocompleteService) {
        setLoading(false);
        return;
      }

      if (!sessionToken.current) sessionToken.current = createAutocompleteSessionToken();

      setLoading(true);
      autocompleteService.getPlacePredictions(
        { input: query, sessionToken: sessionToken.current },
        (predictions, status) => {
          const preds = status === 'OK' && predictions ? predictions : [];
          cache.current.set(query, preds);
          setOptions(buildOptions(preds, query));
          setLoading(false);
        }
      );
    },
    [buildOptions]
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
      if (components.postalCode) {
        callback(components);
        return;
      }
      reverseGeocode(location).then((fallback) => {
        callback({ ...components, postalCode: fallback?.postalCode || components.postalCode });
      });
    },
    []
  );

  /** Ends the current Autocomplete session (predictions + a details/geocode call are done). */
  const endSession = useCallback(() => {
    sessionToken.current = undefined;
  }, []);

  // Typed or pasted free text that was never picked from the suggestion list —
  // e.g. paste-then-blur, paste-then-Enter, or the explicit "Enter manually"
  // option. Geocodes it the same way a selected suggestion would be, so a
  // pasted address is never silently discarded.
  const commitManualEntry = useCallback(
    (rawLabel: string) => {
      const trimmed = rawLabel.trim();
      if (!trimmed) return;

      setLoading(true);
      geocodeAddress(trimmed).then((structured) => {
        setLoading(false);
        endSession();

        if (structured) {
          const label = structured.formattedAddress || trimmed;
          setSelectedOption({ value: structured.placeId ?? MANUAL_VALUE, label });
          setInputValue(label);
          onPlaceSelect({
            address: label,
            streetLine: structured.streetLine,
            location: structured.location,
            placeId: structured.placeId,
            city: structured.city,
            state: structured.state,
            postalCode: structured.postalCode,
            country: structured.country,
          });
        } else {
          setSelectedOption({ value: MANUAL_VALUE, label: trimmed, isManual: true });
          onPlaceSelect({ address: trimmed, location: { lat: 0, lng: 0 }, isManualAddressOnly: true });
        }
      });
    },
    [onPlaceSelect, endSession]
  );

  const handleChange = useCallback(
    (_: React.SyntheticEvent, option: LocationOption | string | null) => {
      if (!option) {
        setSelectedOption(null);
        return;
      }

      // freeSolo lets MUI hand back the raw typed string (Enter with nothing
      // highlighted) instead of a LocationOption — treat it as manual entry.
      if (typeof option === 'string') {
        commitManualEntry(option);
        return;
      }

      setSelectedOption(option);

      if (option.isManual) {
        commitManualEntry(option.label);
        return;
      }

      const placesService = getPlacesService();
      if (!placesService) return;
      placesService.getDetails(
        { placeId: option.value, fields: [...PLACE_DETAIL_FIELDS], sessionToken: sessionToken.current },
        (place, status) => {
          endSession();
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
    [onPlaceSelect, commitManualEntry, withPostalCodeFallback, endSession]
  );

  // Paste-then-blur (or paste-then-Tab) never fires onChange because no
  // dropdown option was ever selected — without this, the pasted address is
  // silently dropped and the field reverts to whatever was there before.
  const handleBlur = useCallback(() => {
    if (!inputValue.trim()) return;
    if (selectedOption && selectedOption.label === inputValue) return; // already committed
    commitManualEntry(inputValue);
  }, [inputValue, selectedOption, commitManualEntry]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      filterOptions={(x) => x}
      inputValue={inputValue}
      value={selectedOption}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onBlur={handleBlur}
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

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StandaloneDropdown } from '../Forms/Dropdown/StandaloneDropdown';
import type { DropdownOption } from '../Forms/Dropdown/Dropdown.types';
import type { PlacesAutocompleteProps } from './GoogleMap.types';

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
  defaultValue,
}) => {
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const predictionsCache = useRef<Map<string, google.maps.places.AutocompletePrediction[]>>(new Map());

  const [apiData, setApiData] = useState<google.maps.places.AutocompletePrediction[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    }
  }, []);

  const fetchPredictions = async (query: string) => {
    if (!query || query.length < 2) {
      setApiData([]);
      setIsSuccess(false);
      return { data: [] };
    }

    // Lazy init fallback
    if (!autocompleteService.current && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
    }

    if (!autocompleteService.current) return { data: [] };

    // Check cache
    if (predictionsCache.current.has(query)) {
      const cached = predictionsCache.current.get(query)!;
      setApiData(cached);
      setIsSuccess(true);
      setIsError(false);
      return { data: cached };
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const result = await autocompleteService.current.getPlacePredictions({ input: query });
      const predictions = result?.predictions ?? [];
      predictionsCache.current.set(query, predictions);
      setApiData(predictions);
      setIsSuccess(true);
      setIsLoading(false);
      return { data: predictions };
    } catch {
      setIsError(true);
      setIsLoading(false);
      setApiData([]);
      return { data: [] };
    }
  };

  const placesApiHook = {
    isLoading,
    isSuccess,
    isError,
    data: apiData,
    callApi: async (params?: Record<string, unknown>) => {
      await fetchPredictions(params?.query as string);
    },
    callAsyncApi: async (params?: Record<string, unknown>) => {
      return await fetchPredictions(params?.query as string);
    },
  };

  const setFetchedOption = useCallback((data: unknown): DropdownOption[] => {
    if (!Array.isArray(data)) return [];
    const predictions = data as google.maps.places.AutocompletePrediction[];
    return predictions.map((p) => ({
      value: p.place_id,
      label: p.description,
      disabled: false,
    }));
  }, []);

  const getQueryParams = useCallback((keywordOrDependency?: unknown, keyword?: string): Record<string, unknown> => {
    const query = typeof keywordOrDependency === 'string' ? keywordOrDependency : keyword || '';
    return { query };
  }, []);

  const handleValueChange = useCallback(
    (value: string | number) => {
      if (!placesService.current) return;
      placesService.current.getDetails(
        { placeId: value.toString(), fields: ['name', 'formatted_address', 'geometry', 'place_id'] },
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
    [onPlaceSelect]
  );

  const defaultOption = defaultValue
    ? ({ value: '__preset__', label: defaultValue, disabled: false } as unknown as string)
    : undefined;

  return (
    <StandaloneDropdown
      name="location-search"
      placeHolder={placeholder}
      isAsync={true}
      apiHook={placesApiHook}
      setFetchedOption={setFetchedOption}
      getQueryParams={getQueryParams}
      onValueChange={handleValueChange}
      fullWidth={true}
      size="medium"
      disableClearable={false}
      disablePortal={true}
      defaultValue={defaultOption}
    />
  );
};

export default PlacesAutocomplete;

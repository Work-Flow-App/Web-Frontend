import React, { useState, useCallback, useRef } from 'react';
import { StandaloneDropdown } from '../Forms/Dropdown/StandaloneDropdown';
import type { DropdownOption } from '../Forms/Dropdown/Dropdown.types';
import { NOMINATIM_CONFIG } from '../../../config/googleMaps';
import type { LocationSearchProps, PlaceDetails, NominatimSearchResult } from './LeafletMap.types';

/**
 * LocationSearch Component
 * Uses StandaloneDropdown with Nominatim (OpenStreetMap) geocoding
 * Following the Floow design system component pattern
 * 100% FREE - No API key required
 */
const LocationSearch: React.FC<LocationSearchProps> = ({
  onPlaceSelect,
  placeholder = 'Search for a location...',
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(undefined);
  const searchCacheRef = useRef<Map<string, NominatimSearchResult[]>>(new Map());

  // Custom API hook for async location search
  const [apiData, setApiData] = useState<NominatimSearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setApiData([]);
      setIsSuccess(true);
      setIsError(false);
      return { data: [] };
    }

    // Check cache first
    if (searchCacheRef.current.has(query)) {
      const cachedData = searchCacheRef.current.get(query)!;
      setApiData(cachedData);
      setIsSuccess(true);
      setIsError(false);
      return { data: cachedData };
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const searchParams = new URLSearchParams({
        q: query,
        format: NOMINATIM_CONFIG.searchParams.format,
        addressdetails: NOMINATIM_CONFIG.searchParams.addressdetails.toString(),
        limit: NOMINATIM_CONFIG.searchParams.limit.toString(),
      });

      const response = await fetch(`${NOMINATIM_CONFIG.baseUrl}/search?${searchParams}`, {
        headers: {
          'User-Agent': 'WorkFlow App',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data: NominatimSearchResult[] = await response.json();

      // Cache the results
      searchCacheRef.current.set(query, data);
      setApiData(data);
      setIsSuccess(true);
      setIsLoading(false);

      return { data };
    } catch (error) {
      console.error('Error fetching locations:', error);
      setIsError(true);
      setIsLoading(false);
      setApiData([]);
      return { data: [] };
    }
  };

  const nominatimApiHook = {
    isLoading,
    isSuccess,
    isError,
    data: apiData,
    callApi: async (params?: Record<string, unknown>) => {
      const query = params?.query as string;
      await fetchLocations(query);
    },
    callAsyncApi: async (params?: Record<string, unknown>) => {
      const query = params?.query as string;
      return await fetchLocations(query);
    },
  };

  // Convert Nominatim results to Dropdown options
  const setFetchedOption = useCallback((data: unknown): DropdownOption[] => {
    if (!Array.isArray(data)) return [];

    const results = data as NominatimSearchResult[];

    return results.map((result) => ({
      value: result.place_id.toString(),
      label: result.display_name,
      disabled: false,
    }));
  }, []);

  // Get query params for async search
  const getQueryParams = useCallback((keywordOrDependency?: unknown, keyword?: string): Record<string, unknown> => {
    // Handle both call patterns from StandaloneDropdown
    // Pattern 1: getQueryParams(inputFieldValue) - called from handleOnKeyUp
    // Pattern 2: getQueryParams(dependencyValue, keyword) - called from other places
    const searchQuery = typeof keywordOrDependency === 'string' ? keywordOrDependency : (keyword || '');

    return {
      query: searchQuery,
    };
  }, []);

  // Handle selection change
  const handleValueChange = useCallback(
    (value: string | number) => {
      // Update selected value
      setSelectedValue(value);

      // Find the selected option from cache
      for (const results of searchCacheRef.current.values()) {
        const result = results.find((r) => r.place_id.toString() === value.toString());
        if (result) {
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
          break;
        }
      }
    },
    [onPlaceSelect]
  );

  return (
    <StandaloneDropdown
      name="location-search"
      placeHolder={placeholder}
      isAsync={true}
      apiHook={nominatimApiHook}
      setFetchedOption={setFetchedOption}
      getQueryParams={getQueryParams}
      onValueChange={handleValueChange}
      value={selectedValue}
      fullWidth
      size="medium"
      disableClearable={false}
    />
  );
};

export default LocationSearch;

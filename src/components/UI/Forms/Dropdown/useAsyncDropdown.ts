import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  UseAsyncDropdownOptions,
  UseAsyncDropdownReturn,
  DropdownOption,
} from './UniversalDropdown.types';

/**
 * Hook for managing async data fetching in UniversalDropdown
 *
 * @example
 * ```tsx
 * const { options, loading, onSearch } = useAsyncDropdown({
 *   fetchFn: async (searchTerm) => {
 *     const response = await api.getUsers(searchTerm);
 *     return response.data;
 *   },
 *   transformFn: (users) => users.map(u => ({ label: u.name, value: u.id })),
 *   fetchOnMount: true,
 * });
 *
 * <UniversalDropdown
 *   options={options}
 *   loading={loading}
 *   onSearch={onSearch}
 * />
 * ```
 */
export const useAsyncDropdown = <T = any>(
  config: UseAsyncDropdownOptions<T>
): UseAsyncDropdownReturn => {
  const {
    fetchFn,
    transformFn,
    initialOptions = [],
    fetchOnMount = false,
    debounce = 300,
  } = config;

  const [options, setOptions] = useState<DropdownOption[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Transform raw data to dropdown options
  const transformData = useCallback(
    (data: T[]): DropdownOption[] => {
      if (transformFn) {
        return transformFn(data);
      }

      // Default transformation
      return data.map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const obj = item as any;
          // Try to find common label/value patterns
          const label = obj.label || obj.name || obj.title || String(obj);
          const value = obj.value || obj.id || obj.key || index;
          return { label, value };
        }
        return { label: String(item), value: item as any };
      });
    },
    [transformFn]
  );

  // Fetch data
  const fetchData = useCallback(
    async (searchTerm?: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFn(searchTerm);

        if (isMountedRef.current) {
          const transformed = transformData(data);
          setOptions(transformed);
          setLoading(false);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error('Failed to fetch data');
          setError(error);
          setOptions([]);
          setLoading(false);
        }
      }
    },
    [fetchFn, transformData]
  );

  // Handle search with debounce
  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          fetchData(searchTerm);
        }
      }, debounce);
    },
    [fetchData, debounce]
  );

  // Fetch on mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchOnMount, fetchData]);

  return {
    options,
    loading,
    onSearch: handleSearch,
    error,
    refetch: () => fetchData(),
  };
};

export default useAsyncDropdown;

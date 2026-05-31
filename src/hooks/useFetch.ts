import { useState, useEffect, useCallback, useRef, type DependencyList } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
}

interface UseFetchOptions {
  onError?: (err: unknown) => void;
  skip?: boolean;
}

export interface UseFetchResult<T> extends FetchState<T> {
  refetch: () => void;
}

/**
 * Drop-in for the setLoading(true) → service.call() → setData → setLoading(false) pattern.
 *
 * const { data, loading, refetch } = useFetch(
 *   () => service.getItems(),
 *   [dep1],
 *   { onError: (err) => showError(extractErrorMessage(err, 'Failed to load')) }
 * );
 */
export function useFetch<T>(
  fn: () => Promise<{ data: T }>,
  deps: DependencyList = [],
  options?: UseFetchOptions
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !options?.skip,
    error: null,
  });

  // Keep fn and onError in refs so stale closures never cause extra re-renders
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const onErrorRef = useRef(options?.onError);
  onErrorRef.current = options?.onError;

  const execute = useCallback(() => {
    if (options?.skip) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    fnRef.current()
      .then(res => setState({ data: res.data, loading: false, error: null }))
      .catch(err => {
        setState(prev => ({ ...prev, loading: false, error: err }));
        onErrorRef.current?.(err);
      });
  // deps are the only external dependencies that should re-trigger the fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.skip, ...deps]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}

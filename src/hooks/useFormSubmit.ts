import { useState, useCallback } from 'react';

interface UseFormSubmitResult {
  saving: boolean;
  /** Wraps an async action: sets saving=true before, saving=false after (always). */
  withSaving: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
}

/**
 * Eliminates the `const [saving, setSaving] = useState(false)` + try/finally boilerplate
 * in form submit handlers.
 *
 * const { saving, withSaving } = useFormSubmit();
 *
 * const onSubmit = (data) => withSaving(async () => {
 *   await service.create(data);
 *   showSuccess('Saved');
 *   onClose();
 * });
 */
export function useFormSubmit(): UseFormSubmitResult {
  const [saving, setSaving] = useState(false);

  const withSaving = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    setSaving(true);
    try {
      return await fn();
    } finally {
      setSaving(false);
    }
  }, []);

  return { saving, withSaving };
}

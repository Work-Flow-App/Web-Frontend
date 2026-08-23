export const MANUAL_VALUE = '__manual__';

export const DEBOUNCE_DELAY_MS = 300;

export const MIN_SEARCH_LENGTH = 2;

export const PLACE_DETAIL_FIELDS = ['name', 'formatted_address', 'geometry', 'place_id', 'address_components'] as const;

// Address component extraction and all geocoding live in the single shared
// module — see src/utils/googleGeocoding.ts — so every consumer parses
// Google results the same way.
export { extractAddressComponents } from '../../../utils/googleGeocoding';

export const getNoOptionsText = (inputValue: string): string => {
  return inputValue.length < MIN_SEARCH_LENGTH
    ? 'Type at least 2 characters to search…'
    : 'No suggestions found — try "Enter manually" below';
};

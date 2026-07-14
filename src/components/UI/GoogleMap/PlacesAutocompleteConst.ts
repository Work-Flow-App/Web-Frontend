export const MANUAL_VALUE = '__manual__';

export const DEBOUNCE_DELAY_MS = 300;

export const MIN_SEARCH_LENGTH = 2;

export const PLACE_DETAIL_FIELDS = ['name', 'formatted_address', 'geometry', 'place_id', 'address_components'] as const;

export function extractAddressComponents(components: google.maps.GeocoderAddressComponent[] | undefined) {
  const get = (type: string) =>
    components?.find((c) => c.types.includes(type));
  return {
    city: get('locality')?.long_name ?? get('postal_town')?.long_name ?? get('sublocality_level_1')?.long_name ?? '',
    state: get('administrative_area_level_1')?.long_name ?? '',
    postalCode: get('postal_code')?.long_name ?? get('postal_code_prefix')?.long_name ?? '',
    country: get('country')?.long_name ?? '',
  };
}

export const getNoOptionsText = (inputValue: string): string => {
  return inputValue.length < MIN_SEARCH_LENGTH
    ? 'Type at least 2 characters to search…'
    : 'No suggestions found — try "Enter manually" below';
};
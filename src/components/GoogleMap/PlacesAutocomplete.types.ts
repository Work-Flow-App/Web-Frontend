import type { PlaceDetails } from './GoogleMap.types';

export interface LocationOption {
  value: string;
  label: string;
  isManual?: boolean;
}

export interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}
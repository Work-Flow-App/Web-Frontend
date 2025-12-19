export interface Location {
  lat: number;
  lng: number;
}

export interface PlaceDetails {
  address: string;
  name?: string;
  location: Location;
  placeId?: string;
}

export interface GoogleMapProps {
  center?: Location;
  zoom?: number;
  markers?: PlaceDetails[];
  onLocationSelect?: (location: PlaceDetails) => void;
  height?: string | number;
  width?: string | number;
  showSearchBox?: boolean;
  className?: string;
}

export interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

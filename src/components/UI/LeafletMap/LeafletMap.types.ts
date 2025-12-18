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

export interface LeafletMapProps {
  center?: Location;
  zoom?: number;
  markers?: PlaceDetails[];
  onLocationSelect?: (location: PlaceDetails) => void;
  height?: string | number;
  width?: string | number;
  showSearchBox?: boolean;
  className?: string;
}

export interface LocationSearchProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

export interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    [key: string]: string;
  };
  boundingbox: string[];
}

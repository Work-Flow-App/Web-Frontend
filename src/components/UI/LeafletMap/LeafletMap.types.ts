export interface Location {
  lat: number;
  lng: number;
}

export interface JobMarkerData {
  jobId: number;
  status: string;
  scheduledTime?: string;
  duration?: string;
  clientName?: string;
  templateName?: string;
}

export interface WorkerMarkerData {
  workerId: number;
  workerName: string;
  workerEmail?: string;
  workerPhone?: string;
  jobs: JobMarkerData[];
}

export interface PlaceDetails {
  address: string;
  name?: string;
  location: Location;
  placeId?: string;
  workerData?: WorkerMarkerData;
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
  selectedLocation?: PlaceDetails | null;
}

export interface LocationSearchProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
  currentValue?: string;
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

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

export interface JobLocationMarkerData {
  jobId: number;
  status: string;
  clientName?: string;
  customerName?: string;
  workerName?: string;
  scheduledTime?: string;
  templateName?: string;
}

export interface PlaceDetails {
  address: string;
  name?: string;
  location: Location;
  placeId?: string;
  workerData?: WorkerMarkerData;
  jobLocationData?: JobLocationMarkerData;
}

export interface GoogleMapProps {
  center?: Location;
  zoom?: number;
  markers?: PlaceDetails[];
  onLocationSelect?: (location: PlaceDetails) => void;
  selectedLocation?: PlaceDetails | null;
  focusedMarker?: PlaceDetails | null;
  height?: string | number;
  width?: string | number;
  showSearchBox?: boolean;
  searchInitialValue?: string;
  className?: string;
}

export interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

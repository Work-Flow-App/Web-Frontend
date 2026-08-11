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
  /** Google's full one-line formatted address — display/search-box use only, never a "street" field value. */
  address: string;
  /** Just the number + street name, e.g. "10 Downing Street". Use this (falling back to `address`) for a street field. */
  streetLine?: string;
  name?: string;
  location: Location;
  placeId?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  workerData?: WorkerMarkerData;
  jobLocationData?: JobLocationMarkerData;
  /** True when Google couldn't geocode the address — user should click map to set pin */
  isManualAddressOnly?: boolean;
}

export interface GoogleMapProps {
  center?: Location;
  zoom?: number;
  markers?: PlaceDetails[];
  onLocationSelect?: (location: PlaceDetails) => void;
  selectedLocation?: PlaceDetails | null;
  focusedMarker?: PlaceDetails | null;
  autoFitBounds?: boolean;
  height?: string | number;
  width?: string | number;
  showSearchBox?: boolean;
  searchInitialValue?: string;
  className?: string;
  showDirections?: boolean;
}

export interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
}

export interface AddressReviewDialogProps {
  open: boolean;
  initialValue: PlaceDetails | null;
  onConfirm: (place: PlaceDetails) => void;
  onCancel: () => void;
}

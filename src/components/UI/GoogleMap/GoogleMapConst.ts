// Single source of truth for job-status pin/chip colors — every place that
// colors something by job status (map pins, InfoWindow chips, the Maps page
// legend/filter chips) must import this rather than keep its own copy, or
// the two silently drift (which is how NEW/CANCELLED previously ended up
// uncolored on the actual map pins while still shown in color in the legend).
export const STATUS_COLORS: Record<string, string> = {
  NEW: '#9c27b0',
  PENDING: '#ff9800',
  IN_PROGRESS: '#2196f3',
  COMPLETED: '#4caf50',
  CANCELLED: '#f44336',
};

/** Non-status color for worker pins, so they're visually distinct from job-status pins instead of falling back to Google's plain default marker. */
export const WORKER_MARKER_COLOR = '#5c6bc0';

export const DIRECTIONS_POLYLINE_OPTIONS = {
  strokeColor: '#1976d2',
  strokeWeight: 5,
  strokeOpacity: 0.85,
};

export const DIRECTIONS_RENDERER_OPTIONS = {
  suppressMarkers: false,
  polylineOptions: DIRECTIONS_POLYLINE_OPTIONS,
};

export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

export const getMarkerIcon = (
  jobStatus: string | undefined,
  isInProgress: boolean,
  isWorker: boolean = false
): google.maps.Symbol | undefined => {
  if (!jobStatus && !isWorker) return undefined;
  return {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    fillColor: jobStatus ? (STATUS_COLORS[jobStatus] ?? '#9e9e9e') : WORKER_MARKER_COLOR,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 1.5,
    scale: isInProgress ? 2.2 : 1.7,
    anchor: new google.maps.Point(12, 22),
  };
};

export const getGeolocationErrorMessage = (err: GeolocationPositionError): string => {
  return err.code === err.PERMISSION_DENIED
    ? 'Location access denied. Please allow location access and try again.'
    : 'Could not get your location. Please try again.';
};
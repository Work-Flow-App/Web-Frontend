export const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#4caf50',
  IN_PROGRESS: '#2196f3',
  PENDING: '#ff9800',
};

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
  isInProgress: boolean
): google.maps.Symbol | undefined => {
  if (!jobStatus) return undefined;
  return {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    fillColor: STATUS_COLORS[jobStatus] ?? '#9e9e9e',
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
/**
 * Map Configuration
 *
 * Supports multiple map providers:
 * - OpenStreetMap with Leaflet (FREE - No API key required)
 * - Google Maps (Requires API key from https://console.cloud.google.com/)
 */

// Map Provider Selection
export type MapProvider = 'leaflet' | 'google';
export const ACTIVE_MAP_PROVIDER: MapProvider = 'leaflet'; // Change to 'google' if you want to use Google Maps

// Google Maps Configuration (Optional - only if using Google Maps)
export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places', 'geocoding'] as ('places' | 'geocoding')[],

  // Default map configuration
  defaultCenter: {
    lat: 50.4501, // Kyiv, Ukraine
    lng: 30.5234,
  },
  defaultZoom: 12,

  // Map styling options
  mapOptions: {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
  },
};

// Leaflet/OpenStreetMap Configuration (FREE)
export const LEAFLET_CONFIG = {
  // Default map configuration - United Kingdom (London)
  defaultCenter: {
    lat: 51.5074, // London, UK
    lng: -0.1278,
  },
  defaultZoom: 6, // Country view - shows UK

  // Map tile layer - Standard OpenStreetMap
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },

  // Alternative tile layers (uncomment to use):

  // CartoDB Positron (English labels, light theme)
  // tileLayer: {
  //   url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  //   maxZoom: 20,
  //   subdomains: 'abcd',
  // },

  // CartoDB Dark Mode (English labels, dark theme)
  // tileLayer: {
  //   url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  //   attribution:
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  //   maxZoom: 20,
  // },

  // Stamen Terrain (English labels with terrain)
  // tileLayer: {
  //   url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
  //   attribution:
  //     'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   maxZoom: 18,
  // },
};

// Nominatim API for geocoding (FREE - OpenStreetMap's geocoding service)
export const NOMINATIM_CONFIG = {
  baseUrl: 'https://nominatim.openstreetmap.org',
  searchParams: {
    format: 'json',
    addressdetails: 1,
    limit: 10,
    // countrycodes removed to allow global search
  },
};

// TomTom Traffic Configuration (Optional - for traffic layer)
export const TOMTOM_CONFIG = {
  apiKey: import.meta.env.VITE_TOMTOM_API_KEY || '',
  trafficFlow: {
    // Traffic flow tiles showing congestion levels
    // relative0 = current traffic relative to free flow
    // Styles: relative (green/yellow/red), absolute (speed in km/h), relative-delay (delay time)
    url: 'https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.tomtom.com">TomTom</a>',
    opacity: 0.7,
    zIndex: 1000,
  },
  trafficIncidents: {
    // Traffic incidents (accidents, closures, etc.)
    url: 'https://api.tomtom.com/traffic/map/4/tile/incidents/s3/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.tomtom.com">TomTom</a>',
    opacity: 0.8,
    zIndex: 1001,
  },
};

// Validate TomTom API key
export const isTomTomConfigured = (): boolean => {
  return !!TOMTOM_CONFIG.apiKey && TOMTOM_CONFIG.apiKey !== '';
};

// Validate API key (for Google Maps)
export const isGoogleMapsConfigured = (): boolean => {
  return !!GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey !== 'your_google_maps_api_key_here';
};

// Predefined location suggestions for United Kingdom
export const POPULAR_LOCATIONS = [
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
  { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
  { name: 'Leeds', lat: 53.8008, lng: -1.5491 },
  { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
  { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
  { name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
  { name: 'Bristol', lat: 51.4545, lng: -2.5879 },
  { name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
  { name: 'Belfast', lat: 54.5973, lng: -5.9301 },
];

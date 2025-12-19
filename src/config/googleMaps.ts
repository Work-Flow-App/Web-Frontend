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
  // Default map configuration - Ukraine (Kyiv)
  defaultCenter: {
    lat: 50.4501, // Kyiv, Ukraine
    lng: 30.5234,
  },
  defaultZoom: 6, // Country view - shows Ukraine

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

// Validate API key (for Google Maps)
export const isGoogleMapsConfigured = (): boolean => {
  return !!GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.apiKey !== 'your_google_maps_api_key_here';
};

// Predefined location suggestions for Ukraine
export const POPULAR_LOCATIONS = [
  { name: 'Kyiv', lat: 50.4501, lng: 30.5234 },
  { name: 'Kharkiv', lat: 49.9935, lng: 36.2304 },
  { name: 'Odesa', lat: 46.4825, lng: 30.7233 },
  { name: 'Dnipro', lat: 48.4647, lng: 35.0462 },
  { name: 'Lviv', lat: 49.8397, lng: 24.0297 },
  { name: 'Zaporizhzhia', lat: 47.8388, lng: 35.1396 },
  { name: 'Kryvyi Rih', lat: 47.9105, lng: 33.3917 },
  { name: 'Mykolaiv', lat: 46.9750, lng: 31.9946 },
];

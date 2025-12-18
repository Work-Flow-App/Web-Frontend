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
    lat: 23.8103, // Dhaka, Bangladesh
    lng: 90.4125,
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
  // Default map configuration - Bangladesh (Dhaka)
  defaultCenter: {
    lat: 23.8103, // Dhaka, Bangladesh
    lng: 90.4125,
  },
  defaultZoom: 7, // Country view - shows Bangladesh

  // Map tile layer (English labels)
  // Using CartoDB Positron for clean English labels
  tileLayer: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    subdomains: 'abcd',
  },

  // Alternative tile layers (uncomment to use):

  // Standard OpenStreetMap (shows local language)
  // tileLayer: {
  //   url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   maxZoom: 19,
  // },

  // CartoDB Dark Mode (English labels, dark theme)
  // tileLayer: {
  //   url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  //   maxZoom: 20,
  // },

  // Stamen Terrain (English labels with terrain)
  // tileLayer: {
  //   url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
  //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

// Predefined location suggestions for Bangladesh
export const POPULAR_LOCATIONS = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { name: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name: 'Barisal', lat: 22.7010, lng: 90.3535 },
  { name: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { name: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
];

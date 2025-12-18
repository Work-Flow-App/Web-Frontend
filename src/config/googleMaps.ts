/**
 * Google Maps API Configuration
 *
 * To use Google Maps:
 * 1. Get API key from https://console.cloud.google.com/
 * 2. Enable these APIs:
 *    - Maps JavaScript API
 *    - Places API
 *    - Geocoding API
 * 3. Add VITE_GOOGLE_MAPS_API_KEY to your .env file
 */

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

// Validate API key
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

/**
 * Single shared Google-only address/geocoding module.
 *
 * Every part of the app that needs to turn free text into coordinates, turn
 * coordinates into an address, or extract structured address parts from a
 * Google result MUST go through this file instead of reaching for
 * `new google.maps.Geocoder()` (or Nominatim) directly. That fragmentation is
 * exactly how the app ended up with two different geocoders and two
 * different status/address bugs — see the map investigation this replaces.
 */

export interface StructuredAddress {
  /** Just the number + street name, e.g. "10 Downing Street". Never includes city/postcode/country. */
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  /** Google's one-line formatted address — for display/search-box use only. Never persist this as "street". */
  formattedAddress: string;
  location: { lat: number; lng: number };
  placeId?: string;
}

// ---- Lazily-created singletons (Google's SDK objects are cheap once, expensive to keep re-creating) ----

let geocoderInstance: google.maps.Geocoder | null = null;
let autocompleteServiceInstance: google.maps.places.AutocompleteService | null = null;
let placesServiceInstance: google.maps.places.PlacesService | null = null;

function isGoogleMapsReady(): boolean {
  return !!(typeof window !== 'undefined' && window.google?.maps);
}

export function getGeocoder(): google.maps.Geocoder | null {
  if (!isGoogleMapsReady()) return null;
  if (!geocoderInstance) geocoderInstance = new google.maps.Geocoder();
  return geocoderInstance;
}

export function getAutocompleteService(): google.maps.places.AutocompleteService | null {
  if (!isGoogleMapsReady() || !window.google.maps.places) return null;
  if (!autocompleteServiceInstance) {
    autocompleteServiceInstance = new window.google.maps.places.AutocompleteService();
  }
  return autocompleteServiceInstance;
}

export function getPlacesService(): google.maps.places.PlacesService | null {
  if (!isGoogleMapsReady() || !window.google.maps.places) return null;
  if (!placesServiceInstance) {
    // PlacesService requires a DOM node or map instance; a detached div works fine
    // and only needs to exist once for the whole app.
    placesServiceInstance = new window.google.maps.places.PlacesService(document.createElement('div'));
  }
  return placesServiceInstance;
}

/**
 * A fresh session token for one Autocomplete "type → select" sequence.
 * Google bills predictions + the follow-up Details call together at the
 * cheaper session rate ONLY when the same token is passed to both calls.
 * Call this once when a search interaction starts, and again after it
 * completes (a selection is made / geocode resolves) to start the next one.
 */
export function createAutocompleteSessionToken(): google.maps.places.AutocompleteSessionToken | undefined {
  if (!isGoogleMapsReady() || !window.google.maps.places) return undefined;
  return new window.google.maps.places.AutocompleteSessionToken();
}

// ---- Address component extraction ----

export function extractAddressComponents(
  components: google.maps.GeocoderAddressComponent[] | undefined
): Omit<StructuredAddress, 'formattedAddress' | 'location' | 'placeId'> {
  const get = (type: string) => components?.find((c) => c.types.includes(type));

  const streetNumber = get('street_number')?.long_name ?? '';
  const route = get('route')?.long_name ?? '';
  // Most addresses resolve to "<number> <route>". POI / building-only results
  // (no street_number/route) fall back to the premise/sub-premise name so the
  // street field is never left blank.
  const streetLine =
    [streetNumber, route].filter(Boolean).join(' ') ||
    get('premise')?.long_name ||
    get('subpremise')?.long_name ||
    '';

  return {
    streetLine,
    city: get('locality')?.long_name ?? get('postal_town')?.long_name ?? get('sublocality_level_1')?.long_name ?? '',
    state: get('administrative_area_level_1')?.long_name ?? '',
    postalCode: get('postal_code')?.long_name ?? get('postal_code_prefix')?.long_name ?? '',
    country: get('country')?.long_name ?? '',
  };
}

/**
 * A single Geocoding API call — especially a reverse geocode by point —
 * commonly returns SEVERAL results at different granularities in one
 * response (street address, postal code area, locality, administrative
 * area, ...), not just one. This is the #1 reason UK postcodes come back
 * blank: `results[0]` ("best match") is usually the street/premise-level
 * result and very often does NOT carry a postal_code component, even though
 * a sibling result a few entries down — the one Google specifically typed
 * `postal_code` — has it. Scan the whole array instead of trusting the top
 * hit alone.
 */
function findPostalCodeAcrossResults(results: google.maps.GeocoderResult[]): string {
  for (const result of results) {
    const code = extractAddressComponents(result.address_components).postalCode;
    if (code) return code;
  }
  return '';
}

// ---- Geocoding ----

/**
 * Coordinates -> structured address. Used for "click a point on the map",
 * and internally as a postcode-backfill fallback (a reverse geocode by exact
 * point tends to return a more granular breakdown than a forward search).
 */
export function reverseGeocode(location: { lat: number; lng: number }): Promise<StructuredAddress | null> {
  const geocoder = getGeocoder();
  if (!geocoder) return Promise.resolve(null);

  return new Promise((resolve) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const primary = results[0];
        const components = extractAddressComponents(primary.address_components);
        resolve({
          ...components,
          postalCode: components.postalCode || findPostalCodeAcrossResults(results),
          formattedAddress: primary.formatted_address,
          location,
          placeId: primary.place_id,
        });
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Free-text address (typed, pasted, or picked from a suggestion label) ->
 * structured address. This is the single replacement for every ad-hoc
 * `new google.maps.Geocoder().geocode({ address })` call in the app, and for
 * the old Nominatim-based `geocodeAddress`.
 */
export async function geocodeAddress(address: string): Promise<StructuredAddress | null> {
  if (!address || !address.trim()) return null;
  const geocoder = getGeocoder();
  if (!geocoder) return null;

  const results = await new Promise<google.maps.GeocoderResult[]>((resolve) => {
    geocoder.geocode({ address }, (results, status) => {
      resolve(status === 'OK' && results ? results : []);
    });
  });
  const primary = results[0];
  if (!primary) return null;

  const loc = primary.geometry.location;
  const location = { lat: loc.lat(), lng: loc.lng() };
  const components = extractAddressComponents(primary.address_components);
  const postalCode = components.postalCode || findPostalCodeAcrossResults(results);

  if (postalCode) {
    return { ...components, postalCode, formattedAddress: primary.formatted_address, location, placeId: primary.place_id };
  }

  // Still nothing in this response at all — reverse-geocode the resolved
  // point, which independently returns its own set of multi-granularity
  // results and usually turns up a dedicated postal-code-area match even
  // when the forward text search didn't.
  const fallback = await reverseGeocode(location);
  return {
    ...components,
    postalCode: fallback?.postalCode || '',
    formattedAddress: primary.formatted_address,
    location,
    placeId: primary.place_id,
  };
}

// ---- Display helpers ----

/**
 * Compose a one-line display address from stored parts, skipping any part
 * that's already a substring of `street` (defends against legacy records
 * saved before the street/formatted-address duplication bug was fixed —
 * see the "redundant address on refetch" issue).
 */
export function formatAddress(
  addr?: { street?: string; city?: string; state?: string; postalCode?: string; country?: string } | null
): string {
  if (!addr) return '';
  const street = addr.street?.trim() || '';
  const streetLower = street.toLowerCase();
  const rest = [addr.city, addr.state, addr.postalCode, addr.country]
    .map((part) => part?.trim())
    .filter((part): part is string => !!part && !streetLower.includes(part.toLowerCase()));
  return [street, ...rest].filter(Boolean).join(', ');
}

/** Roughly "same pin" check shared by every marker-dedup comparison on the map. */
export function isSameLocation(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  epsilonDegrees = 0.001
): boolean {
  return Math.abs(a.lat - b.lat) < epsilonDegrees && Math.abs(a.lng - b.lng) < epsilonDegrees;
}

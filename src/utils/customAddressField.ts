/**
 * Job templates' custom-field system has no dedicated "Address" field type on the
 * backend (`workflow-api/api.ts`'s jobFieldType enum is TEXT/NUMBER/DATE/BOOLEAN/
 * DROPDOWN/JSON/REFERENCE). This module is the single place that piggybacks a virtual
 * ADDRESS type on top of the otherwise-unused JSON type, using a sentinel in the
 * field's `options` string to mark which JSON fields are really addresses. Every
 * consumer must go through isAddressField()/parseAddressFieldValue() here instead of
 * re-deriving the JSON+options check inline.
 */

import type { JobTemplateFieldResponse } from '../services/api';
import { extractFieldValue } from './fieldValueHelper';
import { formatAddress } from './googleGeocoding';

export const ADDRESS_FIELD_MARKER = '__ADDRESS__';

export interface StructuredAddressFieldValue {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export function isAddressField(field?: { jobFieldType?: string; options?: string } | null): boolean {
  return !!field && field.jobFieldType === 'JSON' && field.options === ADDRESS_FIELD_MARKER;
}

/**
 * Normalizes a saved address custom-field value into a structured object, regardless of
 * whether the backend hands back a real nested object, a JSON string, or the
 * `{name,label,type,value}` FieldValueResponse wrapper. Returns null (never throws) for
 * anything that isn't a usable address — including one with no street, which callers
 * should treat the same as "not set".
 */
export function parseAddressFieldValue(raw: unknown): StructuredAddressFieldValue | null {
  if (raw === null || raw === undefined) return null;

  let curr: unknown = raw;
  while (curr && typeof curr === 'object' && 'value' in (curr as Record<string, unknown>)) {
    curr = (curr as Record<string, unknown>).value;
  }
  if (curr === null || curr === undefined) return null;

  if (typeof curr === 'string') {
    const trimmed = curr.trim();
    if (!trimmed) return null;
    try {
      curr = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (typeof curr !== 'object' || curr === null) return null;
  const obj = curr as Record<string, unknown>;
  const street = typeof obj.street === 'string' ? obj.street : '';
  if (!street) return null;

  return {
    street,
    city: typeof obj.city === 'string' ? obj.city : '',
    state: typeof obj.state === 'string' ? obj.state : '',
    postalCode: typeof obj.postalCode === 'string' ? obj.postalCode : '',
    country: typeof obj.country === 'string' ? obj.country : '',
    latitude: typeof obj.latitude === 'number' ? obj.latitude : null,
    longitude: typeof obj.longitude === 'number' ? obj.longitude : null,
  };
}

/** One-line display string for an address custom-field value, or '' if unset/unparseable. */
export function formatAddressFieldValue(raw: unknown): string {
  const parsed = parseAddressFieldValue(raw);
  return parsed ? formatAddress(parsed) : '';
}

/**
 * Rebuilds a job's full fieldValues map before a partial custom-field save. Every OTHER
 * address-type field is preserved as its real structured object; everything else is
 * flattened through extractFieldValue, matching the previous inline behavior. Without
 * this, string-flattening an address field here is exactly what would silently corrupt
 * it the next time ANY unrelated custom field on the same job gets saved (Job Details
 * resends the whole fieldValues map on every single-field edit).
 */
export function rebuildFieldValuesForResend(
  existing: Record<string, unknown> | undefined,
  templateFields: JobTemplateFieldResponse[]
): Record<string, unknown> {
  const fieldsById = new Map(
    templateFields.filter((f) => f.id != null).map((f) => [String(f.id), f])
  );
  const result: Record<string, unknown> = {};
  Object.entries(existing || {}).forEach(([key, value]) => {
    const field = fieldsById.get(key);
    if (isAddressField(field)) {
      const parsed = parseAddressFieldValue(value);
      if (parsed) result[key] = parsed;
      return;
    }
    result[key] = extractFieldValue(value);
  });
  return result;
}

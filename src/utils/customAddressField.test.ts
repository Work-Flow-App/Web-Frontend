import { describe, it, expect } from 'vitest';
import {
  ADDRESS_FIELD_MARKER,
  isAddressField,
  parseAddressFieldValue,
  formatAddressFieldValue,
  rebuildFieldValuesForResend,
} from './customAddressField';

describe('isAddressField', () => {
  it('is true for a JSON field marked as an address', () => {
    expect(isAddressField({ jobFieldType: 'JSON', options: ADDRESS_FIELD_MARKER })).toBe(true);
  });

  it('is false for a plain JSON field without the marker', () => {
    expect(isAddressField({ jobFieldType: 'JSON' })).toBe(false);
  });

  it('is false for other field types even with the marker set', () => {
    expect(isAddressField({ jobFieldType: 'TEXT', options: ADDRESS_FIELD_MARKER })).toBe(false);
  });

  it('is false for null/undefined', () => {
    expect(isAddressField(null)).toBe(false);
    expect(isAddressField(undefined)).toBe(false);
  });
});

describe('parseAddressFieldValue', () => {
  const structured = { street: '10 Downing St', city: 'London', state: '', postalCode: 'SW1A 2AA', country: 'UK' };

  it('parses a plain structured object', () => {
    expect(parseAddressFieldValue(structured)).toEqual({
      street: '10 Downing St',
      city: 'London',
      state: '',
      postalCode: 'SW1A 2AA',
      country: 'UK',
      latitude: null,
      longitude: null,
    });
  });

  it('parses a JSON-stringified object', () => {
    expect(parseAddressFieldValue(JSON.stringify(structured))?.street).toBe('10 Downing St');
  });

  it('unwraps a FieldValueResponse-shaped {value: ...} wrapper', () => {
    expect(parseAddressFieldValue({ name: 'site', label: 'Site', type: 'JSON', value: structured })?.city).toBe(
      'London'
    );
  });

  it('returns null for a value with no street', () => {
    expect(parseAddressFieldValue({ city: 'London' })).toBeNull();
  });

  it('returns null for null, undefined, and empty string', () => {
    expect(parseAddressFieldValue(null)).toBeNull();
    expect(parseAddressFieldValue(undefined)).toBeNull();
    expect(parseAddressFieldValue('')).toBeNull();
  });

  it('returns null for an unparseable string instead of throwing', () => {
    expect(parseAddressFieldValue('not json')).toBeNull();
  });
});

describe('formatAddressFieldValue', () => {
  it('formats a structured value into one display line', () => {
    expect(formatAddressFieldValue({ street: '10 Downing St', city: 'London', country: 'UK' })).toBe(
      '10 Downing St, London, UK'
    );
  });

  it('returns an empty string when the value is unparseable', () => {
    expect(formatAddressFieldValue(null)).toBe('');
  });
});

describe('rebuildFieldValuesForResend', () => {
  const templateFields = [
    { id: 1, jobFieldType: 'TEXT' },
    { id: 2, jobFieldType: 'JSON', options: ADDRESS_FIELD_MARKER },
  ] as any;

  it('flattens non-address fields through extractFieldValue', () => {
    const result = rebuildFieldValuesForResend({ '1': { value: 'hello' } }, templateFields);
    expect(result['1']).toBe('hello');
  });

  it('preserves an address field as a structured object instead of flattening it to a string', () => {
    const address = { street: '1 Main St', city: 'York', state: '', postalCode: '', country: 'UK' };
    const result = rebuildFieldValuesForResend({ '2': address }, templateFields);
    expect(result['2']).toEqual({ ...address, latitude: null, longitude: null });
  });

  it('drops an address field that fails to parse rather than resending garbage', () => {
    const result = rebuildFieldValuesForResend({ '2': { city: 'no street' } }, templateFields);
    expect(result['2']).toBeUndefined();
  });

  it('handles an empty/undefined existing map', () => {
    expect(rebuildFieldValuesForResend(undefined, templateFields)).toEqual({});
  });
});

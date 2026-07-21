/**
 * Recursively extracts the raw scalar value from a field value, which can be:
 * - A primitive value (string, number, boolean)
 * - An object containing a `value` property: { value: ... }
 * - A Java/Spring DTO string representation: "{name=customer_name, label=..., value={...}}"
 */
export function extractFieldValue(val: any): string {
  if (val === null || val === undefined) return '';

  let curr = val;

  // 1. Unwrap nested object with 'value' property
  while (curr && typeof curr === 'object' && 'value' in curr) {
    curr = curr.value;
  }

  if (curr === null || curr === undefined) return '';

  // 2. Handle string representation of nested objects or Java toString format
  if (typeof curr === 'string') {
    let s = curr.trim();
    // Iteratively extract 'value=...' if string is in Java DTO format like {name=..., value=...}
    while (s.startsWith('{') && s.includes('value=')) {
      const match = s.match(/value=([^,}]+|\{[^}]+\})/);
      if (match && match[1]) {
        s = match[1].trim();
      } else {
        break;
      }
    }
    return s;
  }

  return String(curr);
}

export interface DropdownOptionLike<T> {
  value: T;
  label: string;
}

/**
 * Our Dropdown form field stores either the raw scalar value or the full
 * { value, label } option object, depending on whether the user touched the
 * field or it was just seeded from defaultValues - normalise to the raw value
 * so submit handlers don't need to care which shape they got.
 */
export const extractDropdownValue = <T>(
  value: T | DropdownOptionLike<T> | null | undefined
): T | undefined => {
  if (value == null) return undefined;
  return typeof value === 'object' && 'value' in (value as object) ? (value as DropdownOptionLike<T>).value : (value as T);
};

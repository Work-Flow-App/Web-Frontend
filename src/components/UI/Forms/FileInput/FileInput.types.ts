export interface FileInputProps {
  /** React Hook Form field name. The field's value is the selected File, or null. */
  name: string;
  label?: string;
  required?: boolean;
  /** Passed to the native input's `accept`, e.g. ".pdf,image/*". */
  accept?: string;
  /** Name of a file already saved on the record, shown until a new file is chosen. */
  existingFileName?: string;
  disabled?: boolean;
  error?: { message?: string };
}

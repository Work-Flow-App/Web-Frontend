export interface CheckboxProps {
  name: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: { message?: string } | boolean;
  disabled?: boolean;
  description?: string;
  hideErrorMessage?: boolean;
}

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: { message?: string } | boolean;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

export type SearchSize = 'small' | 'medium' | 'large';

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  size?: SearchSize;
  width?: string | number;
  className?: string;
  styles?: {
    input?: React.CSSProperties;
  };
}

export interface ICustomiseColumnsProps {
  id?: string;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  columns: string[];
  onChange?: (visibleColumns: string[]) => void;
}

import type { SxProps, Theme } from '@mui/material/styles';
import type { ITableAction, ITableRow } from '../../ITable';

export const getMenuItemStyles = <T extends ITableRow = ITableRow>(
  action: ITableAction<T>
): SxProps<Theme> => ({
  color:
    action.color === 'error' ? 'error.main' :
    action.color === 'warning' ? 'warning.main' :
    action.color === 'success' ? 'success.main' :
    action.color === 'primary' ? 'primary.main' :
    'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});
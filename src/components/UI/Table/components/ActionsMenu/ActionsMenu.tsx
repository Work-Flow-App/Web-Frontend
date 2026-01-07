import React, { useState, useCallback } from 'react';
import { Menu, MenuItem } from '@mui/material';
import type { ITableAction, ITableRow } from '../../ITable';
import { ActionButton } from '../../Table.styles';
import { MoreOptionsIcon } from '../../icons';

interface IActionsMenuProps<T = ITableRow> {
  /** The row data */
  row: T;
  /** Array of action configurations */
  actions: ITableAction<T>[];
}

/**
 * ActionsMenu component for rendering dynamic row actions
 *
 * @component
 * @example
 * ```tsx
 * const actions = [
 *   { id: 'edit', label: 'Edit', onClick: (row) => handleEdit(row) },
 *   { id: 'delete', label: 'Delete', onClick: (row) => handleDelete(row), color: 'error' },
 * ];
 *
 * <ActionsMenu row={rowData} actions={actions} />
 * ```
 */
const ActionsMenu = <T extends ITableRow = ITableRow>({ row, actions }: IActionsMenuProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleActionClick = useCallback(
    (action: ITableAction<T>, event: React.MouseEvent) => {
      event.stopPropagation();
      action.onClick(row);
      handleClose();
    },
    [row, handleClose]
  );

  // Filter actions based on show condition
  const visibleActions = actions.filter((action) =>
    action.show ? action.show(row) : true
  );

  // If no visible actions, don't render anything
  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <>
      <ActionButton onClick={handleOpen}>
        <MoreOptionsIcon />
      </ActionButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {visibleActions.map((action) => {
          const isDisabled = action.disabled ? action.disabled(row) : false;

          return (
            <MenuItem
              key={action.id}
              onClick={(e) => handleActionClick(action, e)}
              disabled={isDisabled}
              sx={{
                color: action.color === 'error' ? 'error.main' :
                       action.color === 'warning' ? 'warning.main' :
                       action.color === 'success' ? 'success.main' :
                       action.color === 'primary' ? 'primary.main' :
                       'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ActionsMenu;

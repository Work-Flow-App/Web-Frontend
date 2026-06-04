import React, { useState, useEffect } from 'react';
import {
  StyledPopover,
  ColumnItemContainer,
  ColumnLabel,
  ColumnSwitch,
} from './CustomizeColumns.styles';
import type { ICustomiseColumnsProps } from './ICustomiseColumns';

const CustomiseColumns: React.FC<ICustomiseColumnsProps> = ({
  id,
  open,
  anchorEl,
  onClose,
  columns,
  onChange,
}) => {
  // Functionality moved here: managing visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns);

  // Keep state synced if columns prop changes
  useEffect(() => {
    setVisibleColumns(columns);
  }, [columns]);

  const handleToggleColumn = (columnName: string) => {
    const newVisibleColumns = visibleColumns.includes(columnName)
      ? visibleColumns.filter((col) => col !== columnName)
      : [...visibleColumns, columnName];

    setVisibleColumns(newVisibleColumns);

    // Pass the state up to the table so it can update its view
    if (onChange) {
      onChange(newVisibleColumns);
    }
  };

  return (
    <StyledPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {columns.map((column) => (
        <ColumnItemContainer key={column}>
          <ColumnLabel>{column}</ColumnLabel>
          <ColumnSwitch
            checked={visibleColumns.includes(column)}
            onChange={() => handleToggleColumn(column)}
          />
        </ColumnItemContainer>
      ))}
    </StyledPopover>
  );
};

export default CustomiseColumns;

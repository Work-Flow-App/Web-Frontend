import React, { useState } from 'react';
import { ViewColumn } from '@mui/icons-material';
import { CustomiseButton } from './CustomizeColumns.styles';
import CustomiseColumns from './CustomiseColumns';

export interface CustomiseColumnsButtonProps {
  columns: string[];
  onChange?: (visibleColumns: string[]) => void;
}

const CustomiseColumnsButton: React.FC<CustomiseColumnsButtonProps> = ({
  columns,
  onChange,
}) => {
  // Only manages whether the popup is open or closed
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'customise-columns-popover' : undefined;

  return (
    <>
      <CustomiseButton
        aria-describedby={id}
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<ViewColumn />}
      >
        Columns
      </CustomiseButton>
      
      <CustomiseColumns
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        columns={columns}
        onChange={onChange}
      />
    </>
  );
};

export default CustomiseColumnsButton;

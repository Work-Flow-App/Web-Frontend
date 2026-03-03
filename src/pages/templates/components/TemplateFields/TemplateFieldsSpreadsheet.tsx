import React, { useState } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShortTextIcon from '@mui/icons-material/ShortText';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import * as S from './TemplateFieldsSpreadsheet.styles';
import type { FieldTableRow } from './FieldsDataColumn';

const EMPTY_ROWS = 25;

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  TEXT: <ShortTextIcon />,
  NUMBER: <TagIcon />,
  DATE: <CalendarTodayIcon />,
  BOOLEAN: <CheckBoxOutlinedIcon />,
  DROPDOWN: <ArrowDropDownCircleOutlinedIcon />,
  MAP: <PlaceOutlinedIcon />,
};

const FIELD_TYPE_LABELS: Record<string, string> = {
  TEXT: 'Text',
  NUMBER: 'Number',
  DATE: 'Date',
  BOOLEAN: 'Boolean',
  DROPDOWN: 'Dropdown',
  MAP: 'Map Location',
};

interface TemplateFieldsSpreadsheetProps {
  fields: FieldTableRow[];
  loading?: boolean;
  onAddField: () => void;
  onEditField: (field: FieldTableRow) => void;
  onDeleteField: (field: FieldTableRow) => void;
}

export const TemplateFieldsSpreadsheet: React.FC<TemplateFieldsSpreadsheetProps> = ({
  fields,
  loading,
  onAddField,
  onEditField,
  onDeleteField,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeField, setActiveField] = useState<FieldTableRow | null>(null);

  const sortedFields = [...fields].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, field: FieldTableRow) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setActiveField(field);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setActiveField(null);
  };

  const handleEdit = () => {
    if (activeField) onEditField(activeField);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (activeField) onDeleteField(activeField);
    handleMenuClose();
  };

  return (
    <S.SpreadsheetContainer>
      <S.SpreadsheetScrollArea>
        <S.SpreadsheetTable>
          <S.SpreadsheetThead>
            <tr>
              <S.CornerCell />
              {sortedFields.map((field) => (
                <S.ColumnHeaderTh
                  key={field.id}
                  isActive={activeField?.id === field.id}
                  title={`${field.label} (${FIELD_TYPE_LABELS[field.jobFieldType] || field.jobFieldType})`}
                >
                  <S.ColumnHeaderContent>
                    <S.ColumnTypeIcon>
                      {FIELD_TYPE_ICONS[field.jobFieldType] || <ShortTextIcon style={{ width: 14, height: 14 }} />}
                    </S.ColumnTypeIcon>
                    <S.ColumnLabel>{field.label}</S.ColumnLabel>
                    {field.required && <S.RequiredMark>*</S.RequiredMark>}
                    <S.ColumnMenuBtn
                      onClick={(e) => handleMenuOpen(e, field)}
                      title="Column options"
                    >
                      <MoreHorizIcon />
                    </S.ColumnMenuBtn>
                  </S.ColumnHeaderContent>
                </S.ColumnHeaderTh>
              ))}
              <S.AddColumnTh onClick={onAddField} title="Add new column">
                <S.AddColumnContent>
                  <AddIcon />
                </S.AddColumnContent>
              </S.AddColumnTh>
            </tr>
          </S.SpreadsheetThead>

          <S.SpreadsheetTbody>
            {loading ? (
              <S.LoadingRow>
                <td colSpan={sortedFields.length + 2}>Loading columns...</td>
              </S.LoadingRow>
            ) : (
              Array.from({ length: EMPTY_ROWS }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  <S.RowNumberTd>{rowIdx + 1}</S.RowNumberTd>
                  {sortedFields.map((field) => (
                    <S.DataTd key={field.id} />
                  ))}
                  <S.EmptyTd />
                </tr>
              ))
            )}
          </S.SpreadsheetTbody>
        </S.SpreadsheetTable>
      </S.SpreadsheetScrollArea>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '6px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit} dense>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '13px', fontFamily: 'Manrope, sans-serif' }}>
            Edit Column
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} dense sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '13px', fontFamily: 'Manrope, sans-serif', color: 'error.main' }}>
            Delete Column
          </ListItemText>
        </MenuItem>
      </Menu>
    </S.SpreadsheetContainer>
  );
};

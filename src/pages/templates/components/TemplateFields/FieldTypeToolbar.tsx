import React from 'react';
import ShortTextIcon from '@mui/icons-material/ShortText';
import TagIcon from '@mui/icons-material/Tag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import * as S from './FieldTypeToolbar.styles';

const FIELD_TYPES = [
  { value: 'TEXT', label: 'Text Input', icon: <ShortTextIcon /> },
  { value: 'NUMBER', label: 'Number', icon: <TagIcon /> },
  { value: 'DATE', label: 'Date Picker', icon: <CalendarTodayIcon /> },
  { value: 'BOOLEAN', label: 'Checkbox', icon: <CheckBoxOutlinedIcon /> },
  { value: 'DROPDOWN', label: 'Dropdown', icon: <ArrowDropDownCircleOutlinedIcon /> },
  { value: 'MAP', label: 'Map Location', icon: <PlaceOutlinedIcon /> },
];

interface FieldTypeToolbarProps {
  onSelectType: (fieldType: string) => void;
}

export const FieldTypeToolbar: React.FC<FieldTypeToolbarProps> = ({ onSelectType }) => {
  return (
    <S.ToolbarWrapper>
      {FIELD_TYPES.map((type) => (
        <S.FieldTypeButton
          key={type.value}
          onClick={() => onSelectType(type.value)}
          title={`Add ${type.label} column`}
        >
          {type.icon}
          {type.label}
        </S.FieldTypeButton>
      ))}
    </S.ToolbarWrapper>
  );
};

import React from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { Input, Checkbox, Dropdown } from '../../../../components/UI/Forms';
import { FormField, FormRow } from '../../../../components/UI/FormComponents';
import { STEP_COLORS } from '../../../../enums';
import { floowColors } from '../../../../theme/colors';
import { TYPE_ICON, TYPE_COLOR } from '../../utils/formFieldRender';
import {
  FORM_FIELD_TYPE_OPTIONS,
  FORM_FIELD_ROLE_TARGET_OPTIONS,
  FORM_FIELD_TYPES_WITH_OPTIONS,
} from '../../../../services/api';
import * as S from './FieldRowsEditor.styles';
import { emptyFieldRow, resolveFieldEnum, type FieldRowsFormShape } from './FieldRowsEditor.utils';

export interface FieldRowsSectionProps {
  title?: string;
  subtitle?: string;
}

/**
 * The "Fields" card: header with a live count, one card per field row, and an "Add Field"
 * button. Assumes the parent form's data shape includes `fields: FieldRowData[]` (see
 * FieldRowsFormShape) — shared by the create-template and edit-fields modals so a template's
 * field list looks and behaves identically whether you're building or editing it.
 */
export const FieldRowsSection: React.FC<FieldRowsSectionProps> = ({
  title = 'Fields',
  subtitle = 'Add the fields workers and company staff will fill in',
}) => {
  const { control } = useFormContext<FieldRowsFormShape>();
  const { fields: rows, append, remove, move } = useFieldArray({ control, name: 'fields' });

  return (
    <S.SectionCard>
      <S.SectionHeader>
        <S.SectionIconBadge tint={floowColors.success.main}>
          <ListAltOutlinedIcon />
        </S.SectionIconBadge>
        <S.SectionHeaderText>
          <S.SectionTitleRow>
            <S.SectionTitle>{title}</S.SectionTitle>
            <S.CountBadge>
              {rows.length} {rows.length === 1 ? 'field' : 'fields'}
            </S.CountBadge>
          </S.SectionTitleRow>
          <S.SectionSubtitle>{subtitle}</S.SectionSubtitle>
        </S.SectionHeaderText>
      </S.SectionHeader>

      {rows.length === 0 && <S.EmptyRowsHint>No fields yet — click "Add Field" below to add one.</S.EmptyRowsHint>}

      {rows.map((row, index) => (
        <FieldRow
          key={row.id}
          index={index}
          canMoveUp={index > 0}
          canMoveDown={index < rows.length - 1}
          onRemove={() => remove(index)}
          onMoveUp={() => move(index, index - 1)}
          onMoveDown={() => move(index, index + 1)}
        />
      ))}

      <S.AddFieldButton type="button" onClick={() => append(emptyFieldRow())}>
        <AddIcon fontSize="small" />
        Add Field
      </S.AddFieldButton>
    </S.SectionCard>
  );
};

interface FieldRowProps {
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ index, canMoveUp, canMoveDown, onRemove, onMoveUp, onMoveDown }) => {
  const { control, formState } = useFormContext<FieldRowsFormShape>();
  const typeValue = useWatch({ control, name: `fields.${index}.type` });
  const labelValue = useWatch({ control, name: `fields.${index}.label` });
  const resolvedType = resolveFieldEnum(typeValue);
  const showOptions = resolvedType ? FORM_FIELD_TYPES_WITH_OPTIONS.includes(resolvedType) : false;
  const rowErrors = formState.errors.fields?.[index];

  const accentColor = STEP_COLORS[index % STEP_COLORS.length];
  const TypeIcon = (resolvedType && TYPE_ICON[resolvedType]) || ListAltOutlinedIcon;

  return (
    <S.FieldRowCard accentcolor={accentColor}>
      <S.FieldRowActions>
        <S.RowActionButton size="small" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move field up">
          <ArrowUpwardIcon fontSize="small" />
        </S.RowActionButton>
        <S.RowActionButton size="small" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move field down">
          <ArrowDownwardIcon fontSize="small" />
        </S.RowActionButton>
        <S.RowActionButton size="small" onClick={onRemove} aria-label="Remove field">
          <CloseIcon fontSize="small" />
        </S.RowActionButton>
      </S.FieldRowActions>

      <S.FieldRowHeader>
        <S.FieldNumberBadge accentcolor={accentColor}>{index + 1}</S.FieldNumberBadge>
        <S.FieldRowTitle>
          <TypeIcon style={{ color: (resolvedType && TYPE_COLOR[resolvedType]) || undefined }} />
          <span>{labelValue?.trim() || `Field ${index + 1}`}</span>
        </S.FieldRowTitle>
      </S.FieldRowHeader>

      <FormField label="Field Label">
        <Input name={`fields.${index}.label`} placeholder="e.g. Site safety checked" hideErrorMessage={false} />
      </FormField>

      <FormRow>
        <FormField label="Field Type">
          <Dropdown
            name={`fields.${index}.type`}
            preFetchedOptions={FORM_FIELD_TYPE_OPTIONS}
            placeHolder="Select field type"
            fullWidth
            disableClearable
            error={rowErrors?.type}
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label="Filled By">
          <Dropdown
            name={`fields.${index}.roleTarget`}
            preFetchedOptions={FORM_FIELD_ROLE_TARGET_OPTIONS}
            placeHolder="Select who fills this field"
            fullWidth
            disableClearable
          />
        </FormField>
      </FormRow>

      {showOptions && (
        <FormField label="Options">
          <Input
            name={`fields.${index}.options`}
            placeholder="Comma-separated choices, e.g. Yes, No, N/A"
            hideErrorMessage={false}
          />
        </FormField>
      )}

      <Checkbox name={`fields.${index}.required`} label="Required field" />
    </S.FieldRowCard>
  );
};
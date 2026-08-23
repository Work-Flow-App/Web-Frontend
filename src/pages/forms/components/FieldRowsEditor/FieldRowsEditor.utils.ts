import { FormFieldDtoRoleTargetEnum } from '../../../../services/api';
import type { FormFieldDto, FormFieldDtoTypeEnum } from '../../../../services/api';

export type EnumOrOption<T> = T | { label: string; value: T } | null;

export interface FieldRowData {
  label: string;
  type: EnumOrOption<FormFieldDtoTypeEnum>;
  roleTarget: EnumOrOption<FormFieldDtoRoleTargetEnum>;
  required: boolean;
  options: string;
}

/** Shape every form embedding <FieldRowsSection /> must have — the section reads/writes the
 * `fields` array via its own useFieldArray, so this is the one thing callers must match. */
export interface FieldRowsFormShape {
  fields: FieldRowData[];
}

export const emptyFieldRow = (): FieldRowData => ({
  label: '',
  type: null,
  roleTarget: FormFieldDtoRoleTargetEnum.Both,
  required: false,
  options: '',
});

export const resolveFieldEnum = <T,>(value: EnumOrOption<T>): T | null =>
  value !== null && typeof value === 'object' && 'value' in value ? value.value : value;

const generateFieldName = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/**
 * Builds the create/update field payload from the current form rows, flagging problem rows via
 * `setError` as it goes. Returns null if any touched row is incomplete — the caller should bail
 * out of submission in that case. A fully untouched row (no label, no type) is silently skipped
 * rather than blocking submission, so a spare blank row left over from "Add Field" doesn't stop
 * you from saving.
 */
export const buildFieldPayload = (
  rows: FieldRowData[],
  setError: (name: `fields.${number}.${'label' | 'type'}`, error: { message: string }) => void
): FormFieldDto[] | null => {
  let hasRowErrors = false;
  const payload: FormFieldDto[] = [];
  rows.forEach((row, index) => {
    const label = row.label?.trim();
    const type = resolveFieldEnum(row.type);
    if (!label && !type) return;

    if (!label) {
      setError(`fields.${index}.label`, { message: 'Field label is required' });
      hasRowErrors = true;
    }
    if (!type) {
      setError(`fields.${index}.type`, { message: 'Field type is required' });
      hasRowErrors = true;
    }
    if (label && type) {
      payload.push({
        name: generateFieldName(label),
        label,
        type,
        roleTarget: resolveFieldEnum(row.roleTarget) || FormFieldDtoRoleTargetEnum.Both,
        required: !!row.required,
        options: row.options || undefined,
        orderIndex: payload.length,
      });
    }
  });
  return hasRowErrors ? null : payload;
};

import { FormFieldDtoRoleTargetEnum, FormFieldDtoTypeEnum } from '../../../../services/api';
import type { FormFieldDto } from '../../../../services/api';

export type EnumOrOption<T> = T | { label: string; value: T } | null;

export interface FieldRowData {
  label: string;
  description?: string;
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
  description: '',
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
  setError: (name: `fields.${number}.${'label' | 'type' | 'options'}`, error: { message: string }) => void
): FormFieldDto[] | null => {
  let hasRowErrors = false;
  const payload: FormFieldDto[] = [];
  rows.forEach((row, index) => {
    const label = row.label?.trim();
    const type = resolveFieldEnum(row.type);
    if (!label && !type) return;

    if (!label) {
      setError(`fields.${index}.label`, { message: type === FormFieldDtoTypeEnum.Section ? 'Section title is required' : 'Field label is required' });
      hasRowErrors = true;
    }
    if (!type) {
      setError(`fields.${index}.type`, { message: 'Field type is required' });
      hasRowErrors = true;
    }

    if (type === FormFieldDtoTypeEnum.Dropdown || type === FormFieldDtoTypeEnum.MultiSelect) {
      const opts = (row.options || '').split(',').map((s) => s.trim());
      const hasEmpty = opts.some((o) => !o);
      if (hasEmpty || opts.length === 0) {
        setError(`fields.${index}.options`, { message: 'Please fill in all options or remove empty ones' });
        hasRowErrors = true;
      }
    }

    if (label && type) {
      const isSection = type === FormFieldDtoTypeEnum.Section;
      payload.push({
        name: generateFieldName(label),
        label,
        description: row.description ? row.description.trim() : undefined,
        type,
        roleTarget: isSection ? FormFieldDtoRoleTargetEnum.Both : resolveFieldEnum(row.roleTarget) || FormFieldDtoRoleTargetEnum.Both,
        required: isSection ? false : !!row.required,
        options: isSection ? undefined : row.options || undefined,
        orderIndex: payload.length,
      });
    }
  });
  return hasRowErrors ? null : payload;
};

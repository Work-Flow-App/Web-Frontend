import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../../../../../components/UI/Button';
import type { CompanyPostGroupResponse } from '../../../../../../services/api';
import { useSchema } from '../../../../../../utils/validation';
import { SchemaField } from '../../SchemaField';
import { PostGroupFormSchema } from './PostGroupFormSchema';
import type { PostGroupFormValues } from './IPostGroupForm';
import { FormWrapper, FormActions } from './PostGroupForm.styles';

interface PostGroupFormProps {
  /** Group being edited; omit to create a new one. */
  group?: CompanyPostGroupResponse;
  submitLabel: string;
  busy?: boolean;
  /** Resolves true when saved, so a create form can clear itself for the next group. */
  onSubmit: (values: PostGroupFormValues) => Promise<boolean>;
  onCancel?: () => void;
}

/**
 * Inline create/rename form for a post group. Rendered inside ManagePostGroups rather than as
 * its own GlobalModal, since only one GlobalModal can be open at a time.
 */
export const PostGroupForm: React.FC<PostGroupFormProps> = ({ group, submitLabel, busy, onSubmit, onCancel }) => {
  const { fieldRules, defaultValues } = useSchema(PostGroupFormSchema, group);

  const methods = useForm<PostGroupFormValues>({
    // useSchema's rules are typed for any object; narrow the resolver to this form's values.
    resolver: yupResolver(fieldRules) as unknown as Resolver<PostGroupFormValues>,
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const submit = handleSubmit(async (data) => {
    const saved = await onSubmit({ name: data.name.trim(), description: data.description?.trim() ?? '' });
    if (saved && !group) reset(defaultValues);
  });

  return (
    <FormProvider {...methods}>
      <FormWrapper onSubmit={submit} noValidate>
        <SchemaField name="name" field={PostGroupFormSchema.name} error={errors.name as FieldError | undefined} />
        <SchemaField
          name="description"
          field={PostGroupFormSchema.description}
          error={errors.description as FieldError | undefined}
        />
        <FormActions>
          {onCancel && (
            <Button size="small" variant="text" color="secondary" type="button" onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
          )}
          <Button size="small" variant="contained" color="primary" type="submit" disabled={busy}>
            {submitLabel}
          </Button>
        </FormActions>
      </FormWrapper>
    </FormProvider>
  );
};

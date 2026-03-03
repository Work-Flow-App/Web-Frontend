import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../../../../components/UI/Button';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { FieldFormSchema, type FieldFormData } from '../../schema/FieldFormSchema';
import { useSchema } from '../../../../utils/validation';
import { FIELD_TYPE_OPTIONS, FieldType } from '../../../../enums';
import * as S from './TemplateFieldPanel.styles';

interface TemplateFieldPanelProps {
  open: boolean;
  isEdit: boolean;
  defaultValues?: Partial<FieldFormData>;
  isLoading?: boolean;
  onSubmit: (data: FieldFormData) => void;
  onClose: () => void;
}

export const TemplateFieldPanel: React.FC<TemplateFieldPanelProps> = ({
  open,
  isEdit,
  defaultValues,
  isLoading,
  onSubmit,
  onClose,
}) => {
  const { fieldRules, defaultValues: schemaDefaults, fieldTitles, placeHolders } = useSchema(FieldFormSchema);

  const methods = useForm<FieldFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(fieldRules) as any,
    defaultValues: { ...schemaDefaults, ...defaultValues },
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch, control, formState: { isSubmitting } } = methods;

  const selectedType = watch(fieldTitles.jobFieldType as keyof FieldFormData);
  const selectedTypeValue = typeof selectedType === 'object' && selectedType !== null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (selectedType as any).value
    : selectedType;

  useEffect(() => {
    reset({ ...schemaDefaults, ...defaultValues });
  }, [defaultValues, schemaDefaults, reset]);

  return (
    <S.RightPanel open={open}>
      <S.PanelHeader>
        <S.PanelTitle>{isEdit ? 'Edit Field' : 'Add Field'}</S.PanelTitle>
        <S.CloseBtn onClick={onClose}>
          <CloseIcon />
        </S.CloseBtn>
      </S.PanelHeader>

      {isLoading ? (
        <S.PanelLoadingState>Loading field data...</S.PanelLoadingState>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <S.FormGrid>

              {/* Row 1: Field Name | Field Type */}
              <S.FormFieldWrapper>
                <S.FieldInputLabel>
                  Field Name <S.Required>*</S.Required>
                </S.FieldInputLabel>
                <Input
                  name={fieldTitles.name}
                  placeholder={placeHolders.name}
                  hideErrorMessage={false}
                />
              </S.FormFieldWrapper>

              <S.FormFieldWrapper>
                <S.FieldInputLabel>
                  Field Type <S.Required>*</S.Required>
                </S.FieldInputLabel>
                <Dropdown
                  name={fieldTitles.jobFieldType}
                  preFetchedOptions={FIELD_TYPE_OPTIONS}
                  placeHolder={placeHolders.jobFieldType}
                  disablePortal
                  fullWidth
                />
              </S.FormFieldWrapper>

              {/* Row 2: Field Label | Order */}
              <S.FormFieldWrapper>
                <S.FieldInputLabel>
                  Field Label <S.Required>*</S.Required>
                </S.FieldInputLabel>
                <Input
                  name={fieldTitles.label}
                  placeholder={placeHolders.label}
                  hideErrorMessage={false}
                />
              </S.FormFieldWrapper>

              <S.FormFieldWrapper>
                <S.FieldInputLabel>Order</S.FieldInputLabel>
                <Input
                  type="number"
                  name={fieldTitles.orderIndex}
                  placeholder={placeHolders.orderIndex}
                />
              </S.FormFieldWrapper>

              <S.Divider />

              {/* Dropdown Options — only visible for DROPDOWN type */}
              {selectedTypeValue === FieldType.DROPDOWN && (
                <S.FormFullWidth>
                  <S.FormFieldWrapper>
                    <S.FieldInputLabel>Dropdown Options</S.FieldInputLabel>
                    <Input
                      name={fieldTitles.options}
                      placeholder={placeHolders.options}
                      hideErrorMessage={false}
                    />
                  </S.FormFieldWrapper>
                </S.FormFullWidth>
              )}

              {/* Required Field section */}
              <S.SectionLabel>Required Field</S.SectionLabel>
              <S.RadioRow>
                <Controller
                  name={fieldTitles.required as keyof FieldFormData}
                  control={control}
                  render={({ field }) => (
                    <>
                      <S.RadioOption
                        selected={field.value === 'true'}
                        onClick={() => field.onChange('true')}
                      >
                        <S.RadioDot selected={field.value === 'true'} />
                        Yes
                      </S.RadioOption>
                      <S.RadioOption
                        selected={field.value !== 'true'}
                        onClick={() => field.onChange('false')}
                      >
                        <S.RadioDot selected={field.value !== 'true'} />
                        No
                      </S.RadioOption>
                    </>
                  )}
                />
              </S.RadioRow>

            </S.FormGrid>

            <S.PanelFooter>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isLoading}
                loading={isSubmitting}
              >
                {isEdit ? 'Update Field' : 'Add Field'}
              </Button>
            </S.PanelFooter>
          </form>
        </FormProvider>
      )}
    </S.RightPanel>
  );
};

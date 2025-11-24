import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobalModalInnerContext } from '../../context';
import type { AddMemberScreenProps, AddMemberFormData } from './AddMemberScreen.types';
import { AddMemberFormSchema } from './AddMemberSchema';
import { useSchema } from '../../../../../utils/validation';
import { Input } from '../../../Forms/Input';
import { Dropdown } from '../../../Forms/Dropdown';
import * as S from './AddMemberScreen.styled';

const DEFAULT_ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Worker', value: 'worker' },
  { label: 'Viewer', value: 'viewer' },
];

export const AddMemberScreen = (props: AddMemberScreenProps) => {
  const { roles = DEFAULT_ROLES, onInvite } = props;

  // Generate schema using the utility
  const { fieldRules, defaultValues, placeHolders, fieldLabels } = useSchema(AddMemberFormSchema);

  // Setup react-hook-form
  const methods = useForm<AddMemberFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  // Global Modal Inner Context
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  useEffect(() => {
    // Set modal configuration
    updateModalTitle('Add Member');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Invite',
      cancelButtonText: 'Cancel',
      confirmButtonOnly: false,
    });

    // Set up close handler
    updateOnClose(() => {
      reset();
    });

    // Set skip reset to true so modal doesn't auto-close on confirm
    // We'll handle it manually after successful submission
    setSkipResetModal?.(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form submission handler
  const onSubmit = async (data: AddMemberFormData) => {
    try {
      // Call the onInvite callback if provided
      if (onInvite) {
        await onInvite(data);
      } else {
        // Default behavior - just log to console
        console.log('Invitation sent:', data);
      }

      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Error sending invitation:', error);
      // You could show an error message here using a snackbar or toast
    }
  };

  // Set up the confirm handler to trigger form submission
  useEffect(() => {
    updateOnConfirm(() => {
      handleSubmit(onSubmit)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <S.FormWrapper>
        <S.FieldWrapper>
          <Input
            name="email"
            label={fieldLabels.email}
            placeholder={placeHolders.email}
            error={errors.email}
            disabled={isSubmitting}
            fullWidth
          />
        </S.FieldWrapper>

        <S.FieldWrapper>
          <Dropdown
            name="role"
            label={fieldLabels.role}
            placeHolder={placeHolders.role}
            preFetchedOptions={roles}
            error={errors.role}
            isDisabled={isSubmitting}
            fullWidth
          />
        </S.FieldWrapper>
      </S.FormWrapper>
    </FormProvider>
  );
};

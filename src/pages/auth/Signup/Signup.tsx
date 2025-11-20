import React, { useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { RadioGroup } from '../../../components/UI/Forms/Radio';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { UserRole } from '../../../types/auth';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { SignupFormSchema } from './SignupSchema';
import {
  SignupContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  DividerContainer,
  DividerLine,
  DividerText,
  SignInLink,
  // FooterText,
  // GoogleButton,
} from './Signup.styles';
import type { SignupFormData } from './ISignup';

// const GoogleIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//     <path
//       d="M18.1713 8.36791H17.5001V8.33325H10.0001V11.6666H14.7096C14.0225 13.6069 12.1763 14.9999 10.0001 14.9999C7.23882 14.9999 5.00007 12.7612 5.00007 9.99992C5.00007 7.23867 7.23882 4.99992 10.0001 4.99992C11.2746 4.99992 12.4342 5.48075 13.3171 6.26617L15.6742 3.90909C14.1859 2.52217 12.1951 1.66659 10.0001 1.66659C5.39798 1.66659 1.66675 5.39784 1.66675 9.99992C1.66675 14.602 5.39798 18.3333 10.0001 18.3333C14.6022 18.3333 18.3334 14.602 18.3334 9.99992C18.3334 9.44117 18.2767 8.89575 18.1713 8.36791Z"
//       fill="#FFC107"
//     />
//     <path
//       d="M2.62756 6.12117L5.36548 8.12909C6.10631 6.29492 7.90048 4.99992 10.0005 4.99992C11.2751 4.99992 12.4347 5.48075 13.3176 6.26617L15.6747 3.90909C14.1864 2.52217 12.1955 1.66659 10.0005 1.66659C6.79923 1.66659 4.02339 3.47367 2.62756 6.12117Z"
//       fill="#FF3D00"
//     />
//     <path
//       d="M10.0001 18.3333C12.1525 18.3333 14.1084 17.5095 15.5871 16.17L13.0079 13.9875C12.1432 14.6452 11.0866 15.0008 10.0001 15C7.83257 15 5.99215 13.6179 5.29882 11.6891L2.58215 13.783C3.96049 16.4816 6.76132 18.3333 10.0001 18.3333Z"
//       fill="#4CAF50"
//     />
//     <path
//       d="M18.1713 8.36791H17.5001V8.33325H10.0001V11.6666H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3334 14.1666 18.3334 9.99992C18.3334 9.44117 18.2767 8.89575 18.1713 8.36791Z"
//       fill="#1976D2"
//     />
//   </svg>
// );

export const Signup: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(SignupFormSchema);

  const methods = useForm<SignupFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = methods;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await authService.signup({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      console.log('Signup successful:', response);

      // Store user role temporarily for the login flow
      localStorage.setItem('pending_user_role', data.role);

      // Clear tokens after signup - user needs to login
      await authService.logout();

      // Show success message
      setSnackbar({
        open: true,
        message: 'Account created successfully! Redirecting to login...',
        variant: 'success',
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Signup failed:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to create account. Please try again.');

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignup = () => {
  //   console.log('Google signup clicked');
  //   // Handle Google OAuth here
  // };

  return (
    <FormProvider {...methods}>
      <SignupContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Get Started!</Title>
              <Subtitle>
                Enter your valid email address and password to access your account.
              </Subtitle>
            </HeaderSection>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="username"
                label={fieldLabels.username}
                type="text"
                placeholder={placeHolders.username}
                fullWidth
                error={errors.username}
              />

              <Input
                name="email"
                label={fieldLabels.email}
                type="email"
                placeholder={placeHolders.email}
                fullWidth
                error={errors.email}
              />

              <PasswordInput
                name="password"
                label={fieldLabels.password}
                placeholder={placeHolders.password}
                fullWidth
                error={errors.password}
                onChange={() => {
                  // Trigger validation on confirmPassword when password changes
                  trigger('confirmPassword');
                }}
              />

              <PasswordInput
                name="confirmPassword"
                label={fieldLabels.confirmPassword}
                placeholder={placeHolders.confirmPassword}
                fullWidth
                error={errors.confirmPassword}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    name="role"
                    label={fieldLabels.role}
                    options={[
                      {
                        label: 'Company',
                        value: UserRole.COMPANY,
                        description: 'Register as a company to post jobs and hire workers',
                      },
                      {
                        label: 'Worker',
                        value: UserRole.WORKER,
                        description: 'Register as a worker to find and apply for jobs',
                      },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.role}
                    orientation="vertical"
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>

              <DividerContainer>
                <DividerLine />
                <DividerText>Or</DividerText>
                <DividerLine />
              </DividerContainer>

              {/* <GoogleButton onClick={handleGoogleSignup}>
                <GoogleIcon />
                Sign up with Google
              </GoogleButton> */}

              <SignInLink>
                Already have an account, <a href="/login">Sign in</a>
              </SignInLink>
            </FormWrapper>

            {/* <FooterText>
              Design and developed by <a href="#">Jetnetix Solutions</a>
            </FooterText> */}
          </FormContainer>
        </LeftSection>

        <AuthRightSection />

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          variant={snackbar.variant}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </SignupContainer>
    </FormProvider>
  );
};

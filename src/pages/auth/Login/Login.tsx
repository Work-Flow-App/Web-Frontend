import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { getRoleFromToken } from '../../../utils/jwt';
import {
  LoginContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  ForgotPasswordLink,
  DividerContainer,
  DividerLine,
  DividerText,
  SignUpLink,
  // GoogleButton,
} from './Login.styles';
import type { LoginFormData } from './Login.types';

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

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const loginResponse = await authService.login({
        userName: data.userName,
        password: data.password,
      });

      console.log('Login successful');

      // Show success message
      setSnackbar({
        open: true,
        message: 'Login successful! Redirecting...',
        variant: 'success',
      });

      // Extract role from JWT token
      const accessToken = loginResponse.data.accessToken;
      let userRole: string | null = null;

      if (accessToken) {
        userRole = getRoleFromToken(accessToken);
        if (userRole) {
          localStorage.setItem('user_role', userRole);
        }
      }

      // Redirect based on user role after 1 second
      setTimeout(() => {
        // Handle both ROLE_COMPANY and COMPANY formats from backend
        if (userRole === 'ROLE_COMPANY' || userRole === 'COMPANY') {
          navigate('/company');
        } else if (userRole === 'ROLE_WORKER' || userRole === 'WORKER') {
          navigate('/worker');
        } else {
          // Default redirect to company page
          navigate('/company');
        }
      }, 1000);
    } catch (error: unknown) {
      console.error('Login failed:', error);
      let errorMessage = 'Failed to sign in. Please try again.';

      // Extract error message from API error response
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   console.log('Google login clicked');
  //   // Handle Google OAuth here
  // };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Navigate to forgot password page
    navigate('/forgot-password');
  };

  return (
    <LoginContainer>
      <LeftSection>
        <FormContainer>
          <HeaderSection>
            <FloowLogo variant="light" showText={true} />
            <Title>Welcome Back!</Title>
            <Subtitle>
              Enter your valid email address and password to access your account.
            </Subtitle>
          </HeaderSection>

          <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              fullWidth
              {...register('userName', {
                required: 'Username is required',
              })}
              error={errors.userName}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              fullWidth
              {...register('password', {
                required: 'Password is required',
              })}
              error={errors.password}
            />

            <ForgotPasswordLink onClick={handleForgotPassword}>
              Forgot Password?
            </ForgotPasswordLink>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </Button>

            <DividerContainer>
              <DividerLine />
              <DividerText>Or</DividerText>
              <DividerLine />
            </DividerContainer>

            {/* <GoogleButton onClick={handleGoogleLogin}>
              <GoogleIcon />
              Sign in with Google
            </GoogleButton> */}

            <SignUpLink>
              <a href="/signup">Create an account</a>
            </SignUpLink>
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
    </LoginContainer>
  );
};

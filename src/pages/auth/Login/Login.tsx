import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleLogin } from '@react-oauth/google';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { getRoleFromToken } from '../../../utils/jwt';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useSchema } from '../../../utils/validation';
import { LoginFormSchema } from './LoginSchema';
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
} from './Login.styles';
import type { LoginFormData } from './ILogin';


export const Login: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(LoginFormSchema);

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
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
      const errorMessage = extractErrorMessage(error, 'Failed to sign in. Please try again.');

      if (errorMessage === 'User is disabled') {
        setShowResendLink(true);
        setSnackbar({
          open: true,
          message: 'Please verify your email before logging in.',
          variant: 'warning',
        });
      } else {
        setShowResendLink(false);
        setSnackbar({
          open: true,
          message: errorMessage,
          variant: 'error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    try {
      const googleResponse = await authService.loginWithGoogle(credential);

      setSnackbar({ open: true, message: 'Login successful! Redirecting...', variant: 'success' });

      const accessToken = googleResponse.data.accessToken;
      let userRole: string | null = null;
      if (accessToken) {
        userRole = getRoleFromToken(accessToken);
        if (userRole) localStorage.setItem('user_role', userRole);
      }

      setTimeout(() => {
        if (userRole === 'ROLE_COMPANY' || userRole === 'COMPANY') {
          navigate('/company');
        } else if (userRole === 'ROLE_WORKER' || userRole === 'WORKER') {
          navigate('/worker');
        } else {
          navigate('/company');
        }
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error, 'Google sign-in failed. Please try again.');
      setSnackbar({ open: true, message: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Navigate to forgot password page
    navigate('/forgot-password');
  };

  return (
    <FormProvider {...methods}>
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
                name="userName"
                label={fieldLabels.userName}
                type="text"
                placeholder={placeHolders.userName}
                fullWidth
                error={errors.userName}
              />

              <PasswordInput
                label={fieldLabels.password}
                placeholder={placeHolders.password}
                fullWidth
                name="password"
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

              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleSuccess(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setSnackbar({
                    open: true,
                    message: 'Google sign-in was cancelled or failed.',
                    variant: 'error',
                  });
                }}
                width="100%"
                text="signin_with"
                shape="rectangular"
                theme="outline"
              />

              {showResendLink && (
                <SignUpLink>
                  <Link to="/resend-verification">Resend verification email</Link>
                </SignUpLink>
              )}

              <SignUpLink>
                Don't have an account? <Link to="/signup">Create an account</Link>
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
    </FormProvider>
  );
};

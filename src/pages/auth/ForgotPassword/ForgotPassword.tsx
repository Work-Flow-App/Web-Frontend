import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { Box } from '@mui/material';
import { Snackbar } from '../../../components/UI/Snackbar';
import { useSchema } from '../../../utils/validation';
import { ForgotPasswordFormSchema } from './ForgotPasswordSchema';
import { authService } from '../../../services/api/auth';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { AuthShell } from '../Login/AuthShell';
import { RouteMapDesktop } from '../Login/RouteMapDesktop';
import { RouteMapPhone } from '../Login/RouteMapPhone';
import { SUPPORT_EMAIL } from '../Login/constants';
import { RLInput, RLForm } from '../Login/styles';
import * as styles from '../Login/styles';
import type { ForgotPasswordFormData } from './IForgotPassword';

export const ForgotPassword: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(ForgotPasswordFormSchema);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(fieldRules as unknown as ObjectSchema<ForgotPasswordFormData>),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await authService.forgotPassword({ email: data.email });

      setSnackbar({
        open: true,
        message: response.data.message || 'Password reset link has been sent to your email!',
        variant: 'success',
      });

      // Redirect to reset password page with email after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      const errorMessage = extractErrorMessage(
        error,
        'Failed to send reset email. Please try again.'
      );

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const FormHeading = (
    <Box sx={styles.headingBox}>
      <Box component="h1" sx={styles.h1Style}>
        Forgot password?
      </Box>
      <Box component="p" sx={styles.subStyle}>
        No worries! Enter your email address and we&apos;ll send you a link to reset your password.
      </Box>
    </Box>
  );

  const SupportCard = (
    <Box sx={styles.supportCard}>
      <Box sx={styles.supportIconBox}>
        <Box
          component="svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0B0E0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          sx={styles.supportSvg}
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Box>
      </Box>
      <Box sx={styles.supportTextStack}>
        <Box component="span" sx={styles.supportTitle}>
          Stuck? Just mail us.
        </Box>
        <Box
          component="a"
          href={`mailto:${SUPPORT_EMAIL}?subject=Help%20with%20password%20reset`}
          sx={styles.supportEmailText}
        >
          {SUPPORT_EMAIL}
        </Box>
      </Box>
    </Box>
  );

  const PrivacyNote = (
    <Box component="p" sx={styles.privacyRow}>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <Box component="span">Your jobs and customer details are kept private</Box>
    </Box>
  );

  const PhoneMap = (
    <RouteMapPhone
      seg1={1}
      seg2={0}
      seg3={0}
      pin1Fill="#0B0E0B"
      pin1Stroke="#A3F000"
      pin2Fill="#FFFFFF"
      pin2Stroke="#B9C2AD"
      pin3Fill="#FFFFFF"
      pin3Stroke="#B9C2AD"
      lit={1}
    />
  );

  return (
    <FormProvider {...methods}>
      <AuthShell
        desktopMap={<RouteMapDesktop />}
        phoneMap={PhoneMap}
        footer={
          <>
            {SupportCard}
            {PrivacyNote}
          </>
        }
        snackbar={
          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            variant={snackbar.variant}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          />
        }
      >
        {FormHeading}
        <RLForm onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={styles.formStack}>
            <Box sx={styles.fieldWrapper}>
              <Box component="label" htmlFor="rl-forgot-email" sx={styles.fieldLabel}>
                {fieldLabels.email || 'Email Address'}
              </Box>
              <RLInput
                id="rl-forgot-email"
                type="email"
                autoComplete="email"
                placeholder={placeHolders.email || 'Enter your email address'}
                aria-invalid={!!errors.email}
                {...methods.register('email')}
              />
            </Box>

            {errors.email && (
              <Box role="alert" sx={styles.errorAlert}>
                <Box component="span" sx={styles.errorAlertText}>
                  {errors.email.message}
                </Box>
              </Box>
            )}

            <Box component="button" type="submit" disabled={isLoading} sx={styles.submitBtn}>
              <Box component="span">{isLoading ? 'Sending...' : 'Send reset link'}</Box>
            </Box>

            <Box
              component="button"
              type="button"
              sx={styles.backToLoginLink}
              onClick={handleBackToLogin}
            >
              Back to Login
            </Box>
          </Box>
        </RLForm>
      </AuthShell>
    </FormProvider>
  );
};
export default ForgotPassword;

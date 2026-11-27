import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { Box } from '@mui/material';
import { Snackbar } from '../../../components/UI/Snackbar';
import { useSchema } from '../../../utils/validation';
import { ResetPasswordFormSchema } from './ResetPasswordSchema';
import { authService } from '../../../services/api/auth';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { AuthShell } from '../Login/AuthShell';
import { RouteMapDesktop } from '../Login/RouteMapDesktop';
import { RouteMapPhone } from '../Login/RouteMapPhone';
import { SUPPORT_EMAIL } from '../Login/constants';
import { RLInput, RLForm } from '../Login/styles';
import * as styles from '../Login/styles';
import type { ResetPasswordFormData } from './IResetPassword';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';

  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(ResetPasswordFormSchema);

  const methods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(fieldRules as unknown as ObjectSchema<ResetPasswordFormData>),
    defaultValues: emailFromParams ? { ...defaultValues, email: emailFromParams } : defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = methods;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });
  const [codeRejected, setCodeRejected] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await authService.resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });
      setSnackbar({
        open: true,
        message:
          response.data.message || 'Password has been reset successfully! Redirecting to login...',
        variant: 'success',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to reset password. Please try again.');
      setCodeRejected((error as { status?: number })?.status === 400);

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNewCode = async () => {
    const email = getValues('email');
    if (!email) {
      trigger('email');
      return;
    }
    setSendingCode(true);
    try {
      const response = await authService.forgotPassword({ email });
      setCodeRejected(false);
      setSnackbar({
        open: true,
        message:
          response.data.message ||
          'We sent a new code to your email. Only the newest code works.',
        variant: 'success',
      });
    } catch (error: unknown) {
      setSnackbar({
        open: true,
        message: extractErrorMessage(error, 'Failed to send a new code. Please try again.'),
        variant: 'error',
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const FormHeading = (
    <Box sx={styles.headingBox}>
      <Box component="h1" sx={styles.h1Style}>
        Reset Password
      </Box>
      <Box component="p" sx={styles.subStyle}>
        Enter the 6-digit verification code sent to your email and choose a new password.
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
      seg2={1}
      seg3={0}
      pin1Fill="#0B0E0B"
      pin1Stroke="#A3F000"
      pin2Fill="#0B0E0B"
      pin2Stroke="#A3F000"
      pin3Fill="#FFFFFF"
      pin3Stroke="#B9C2AD"
      lit={2}
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
            {/* Email field */}
            <Box sx={styles.fieldWrapper}>
              <Box component="label" htmlFor="rl-reset-email" sx={styles.fieldLabel}>
                {fieldLabels.email || 'Email Address'}
              </Box>
              <RLInput
                id="rl-reset-email"
                type="email"
                autoComplete="email"
                placeholder={placeHolders.email || 'Enter your email address'}
                aria-invalid={!!errors.email}
                {...methods.register('email')}
              />
              {errors.email && (
                <Box role="alert" sx={styles.errorAlert}>
                  <Box component="span" sx={styles.errorAlertText}>
                    {errors.email.message}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Code field */}
            <Box sx={styles.fieldWrapper}>
              <Box component="label" htmlFor="rl-reset-code" sx={styles.fieldLabel}>
                {fieldLabels.code || 'Verification Code'}
              </Box>
              <RLInput
                id="rl-reset-code"
                type="text"
                autoComplete="one-time-code"
                placeholder={placeHolders.code || 'Enter 6-digit code'}
                aria-invalid={!!errors.code}
                {...methods.register('code')}
              />
              {errors.code && (
                <Box role="alert" sx={styles.errorAlert}>
                  <Box component="span" sx={styles.errorAlertText}>
                    {errors.code.message}
                  </Box>
                </Box>
              )}
            </Box>

            {/* New Password field */}
            <Box sx={styles.fieldWrapper}>
              <Box component="label" htmlFor="rl-reset-newpass" sx={styles.fieldLabel}>
                {fieldLabels.newPassword || 'New Password'}
              </Box>
              <Box sx={styles.passWrapper}>
                <RLInput
                  id="rl-reset-newpass"
                  type={showNewPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={placeHolders.newPassword || 'Enter your new password'}
                  aria-invalid={!!errors.newPassword}
                  {...methods.register('newPassword', {
                    onChange: () => trigger('confirmPassword'),
                  })}
                />
                <Box
                  component="button"
                  type="button"
                  aria-pressed={showNewPass}
                  sx={styles.eyeBtn}
                  onClick={() => setShowNewPass((s) => !s)}
                >
                  {showNewPass ? 'Hide' : 'Show'}
                </Box>
              </Box>
              {errors.newPassword && (
                <Box role="alert" sx={styles.errorAlert}>
                  <Box component="span" sx={styles.errorAlertText}>
                    {errors.newPassword.message}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Confirm Password field */}
            <Box sx={styles.fieldWrapper}>
              <Box component="label" htmlFor="rl-reset-confirmpass" sx={styles.fieldLabel}>
                {fieldLabels.confirmPassword || 'Confirm Password'}
              </Box>
              <Box sx={styles.passWrapper}>
                <RLInput
                  id="rl-reset-confirmpass"
                  type={showConfirmPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={placeHolders.confirmPassword || 'Confirm your new password'}
                  aria-invalid={!!errors.confirmPassword}
                  {...methods.register('confirmPassword')}
                />
                <Box
                  component="button"
                  type="button"
                  aria-pressed={showConfirmPass}
                  sx={styles.eyeBtn}
                  onClick={() => setShowConfirmPass((s) => !s)}
                >
                  {showConfirmPass ? 'Hide' : 'Show'}
                </Box>
              </Box>
              {errors.confirmPassword && (
                <Box role="alert" sx={styles.errorAlert}>
                  <Box component="span" sx={styles.errorAlertText}>
                    {errors.confirmPassword.message}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Submit button */}
            <Box component="button" type="submit" disabled={isLoading} sx={styles.submitBtn}>
              <Box component="span">{isLoading ? 'Resetting...' : 'Reset Password'}</Box>
            </Box>

            {/* Code rejected prompt */}
            {codeRejected && (
              <Box
                component="button"
                type="button"
                disabled={sendingCode}
                sx={styles.resendCodeBtn}
                onClick={handleSendNewCode}
              >
                {sendingCode ? 'Sending a new code...' : 'Code not working? Send a new code'}
              </Box>
            )}

            {/* Back to login */}
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
export default ResetPassword;

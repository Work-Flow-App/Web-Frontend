import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { WorkerCreateRequest } from '../../services/api/workers';
import { workerService } from '../../services/api/workers';
import { floowColors } from '../../theme/colors';
import { rem } from '../UI/Typography/utility';

/**
 * Form container for spacing
 */
const FormContainer = styled(Box)(({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

/**
 * Row container for fields that should be side by side
 */
const FormRow = styled(Box)(({
  display: 'flex',
  gap: rem(16),
  '& > *': {
    flex: 1,
  },
}));

/**
 * Custom styled TextField
 */
const StyledTextField = styled(TextField)(({
  '& .MuiOutlinedInput-root': {
    borderRadius: rem(6),
  },
}));

/**
 * Dialog button container
 */
const DialogButtonContainer = styled(Box)(({
  display: 'flex',
  gap: rem(12),
  justifyContent: 'flex-end',
  marginTop: rem(24),
}));

/**
 * Add Worker Dialog Props
 */
interface AddWorkerDialogProps {
  open: boolean;
  onClose: () => void;
  onWorkerAdded: (worker: any) => void;
}

/**
 * Initial form state
 */
const initialFormState: WorkerCreateRequest = {
  name: '',
  username: '',
  password: '',
  email: '',
  telephone: '',
  mobile: '',
  initials: '',
};

/**
 * Form validation errors state
 */
interface FormErrors {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
}

/**
 * Add Worker Dialog Component
 *
 * Dialog for creating a new worker with form validation
 * and API integration.
 */
export const AddWorkerDialog: React.FC<AddWorkerDialogProps> = ({
  open,
  onClose,
  onWorkerAdded,
}) => {
  const [formData, setFormData] = useState<WorkerCreateRequest>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * Handle form field changes
   */
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setApiError(null);

      const newWorker = await workerService.createWorker(formData);
      onWorkerAdded(newWorker);

      // Reset form
      setFormData(initialFormState);
      setErrors({});
      onClose();
    } catch (err) {
      console.error('Error creating worker:', err);

      // Extract detailed error message from various error formats
      let errorMessage = 'Failed to create worker. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as any;

        // Check for API response error
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj.response?.statusText) {
          errorMessage = `Error: ${errorObj.response.statusText}`;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }

      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle dialog close
   */
  const handleDialogClose = () => {
    if (!loading) {
      setFormData(initialFormState);
      setErrors({});
      setApiError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: rem(12),
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: rem(18),
          fontWeight: 700,
          color: floowColors.black,
          paddingBottom: rem(16),
        }}
      >
        Add New Worker
      </DialogTitle>

      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ marginBottom: rem(16) }}>
            {apiError}
          </Alert>
        )}

        <FormContainer>
          {/* Name Field */}
          <StyledTextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
            placeholder="Enter worker's full name"
            sx={{ marginTop: rem(8) }}
            required
          />

          {/* Username and Password Row */}
          <FormRow>
            <StyledTextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading}
              placeholder="username"
              required
            />
            <StyledTextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleFormChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </FormRow>

          {/* Email and Telephone Row */}
          <FormRow>
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              placeholder="worker@example.com"
            />
            <StyledTextField
              label="Telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleFormChange}
              disabled={loading}
              placeholder="+1 (555) 000-0000"
            />
          </FormRow>

          {/* Mobile and Initials Row */}
          <FormRow>
            <StyledTextField
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleFormChange}
              disabled={loading}
              placeholder="+1 (555) 000-0000"
            />
            <StyledTextField
              label="Initials"
              name="initials"
              value={formData.initials}
              onChange={handleFormChange}
              disabled={loading}
              placeholder="AB"
              inputProps={{
                maxLength: 4,
              }}
            />
          </FormRow>
        </FormContainer>
      </DialogContent>

      <DialogActions sx={{ padding: rem(16), paddingTop: 0 }}>
        <DialogButtonContainer>
          <Button
            onClick={handleDialogClose}
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontSize: rem(14),
              fontWeight: 600,
              color: floowColors.grey[600],
              padding: `${rem(8)} ${rem(16)}`,
              minHeight: rem(40),
              borderRadius: rem(6),
              border: `1px solid ${floowColors.grey[300]}`,
              '&:hover': {
                backgroundColor: floowColors.grey[50],
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            sx={{
              backgroundColor: floowColors.black,
              color: floowColors.white,
              textTransform: 'none',
              fontSize: rem(14),
              fontWeight: 600,
              padding: `${rem(8)} ${rem(16)}`,
              minHeight: rem(40),
              borderRadius: rem(6),
              '&:hover': {
                backgroundColor: floowColors.grey[900],
              },
              '&:disabled': {
                backgroundColor: floowColors.grey[400],
              },
            }}
          >
            {loading ? <CircularProgress size={rem(20)} /> : 'Add Worker'}
          </Button>
        </DialogButtonContainer>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkerDialog;

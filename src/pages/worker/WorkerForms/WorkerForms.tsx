import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { formService } from '../../../services/api';
import type { FormSubmissionResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useFetch } from '../../../hooks';
import * as M from '../styles/WorkerMobile.styles';

const FORM_STATUS_THEME_MAP: Record<string, keyof typeof M.StatusTheme> = {
  DRAFT: 'NOT_STARTED',
  SENT: 'PENDING',
  IN_PROGRESS: 'STARTED',
  SUBMITTED: 'COMPLETED',
  COMPLETED: 'COMPLETED',
};

const resolveFormStatusTheme = (status?: string) => {
  const key = FORM_STATUS_THEME_MAP[(status || 'DRAFT').toUpperCase()] || 'NOT_STARTED';
  return M.StatusTheme[key];
};

const formatStatusLabel = (status?: string): string => {
  if (!status) return 'Draft';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const WorkerForms: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const { data, loading } = useFetch(() => formService.getMyForms(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load your forms')),
  });

  const forms = useMemo((): FormSubmissionResponse[] => (Array.isArray(data) ? data : []), [data]);

  const handleCardClick = useCallback((row: FormSubmissionResponse) => navigate(`/worker/forms/${row.id}`), [navigate]);

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <h1>My Forms</h1>
      </M.WorkerHeader>

      {loading ? (
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      ) : forms.length === 0 ? (
        <M.EmptyState>
          <DescriptionOutlinedIcon />
          <span>No forms have been sent to you yet.</span>
        </M.EmptyState>
      ) : (
        <M.TaskList>
          {forms.map((form) => {
            const theme = resolveFormStatusTheme(form.status);
            return (
              <M.TaskCard key={form.id} accentColor={theme.accent} onClick={() => handleCardClick(form)}>
                <M.TaskCardTopRow>
                  <M.RefBadgeRow>
                    <M.RefBadge>{form.templateName || 'Form'}</M.RefBadge>
                  </M.RefBadgeRow>
                  <M.StatusPill bg={theme.pillBg} fg={theme.pillFg}>
                    {formatStatusLabel(form.status)}
                  </M.StatusPill>
                </M.TaskCardTopRow>

                <M.TaskTitle>{form.title || form.templateName || `Form #${form.id}`}</M.TaskTitle>
              </M.TaskCard>
            );
          })}
        </M.TaskList>
      )}
    </M.WorkerShell>
  );
};

export default WorkerForms;

import React, { useState } from 'react';
import { Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { WorkerResponse } from '../../../../services/api';
import type { JobWorkflowStepCreateRequest } from '../../../../../workflow-api';
import * as S from './AddStepModal.styles';

interface AddStepModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: JobWorkflowStepCreateRequest) => Promise<void>;
  allWorkers: WorkerResponse[];
  nextOrderIndex: number;
}

export const AddStepModal: React.FC<AddStepModalProps> = ({
  open,
  onClose,
  onSubmit,
  allWorkers,
  nextOrderIndex,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expectedDays, setExpectedDays] = useState<number | string>('');
  const [expectedHours, setExpectedHours] = useState<number | string>('');
  const [maxDays, setMaxDays] = useState<number | string>('');
  const [maxHours, setMaxHours] = useState<number | string>('');
  const [selectedWorkers, setSelectedWorkers] = useState<WorkerResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setExpectedDays('');
    setExpectedHours('');
    setMaxDays('');
    setMaxHours('');
    setSelectedWorkers([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const expectedMinutes = (Number(expectedDays) || 0) * 24 * 60 + (Number(expectedHours) || 0) * 60;
    const maxMinutes = (Number(maxDays) || 0) * 24 * 60 + (Number(maxHours) || 0) * 60;
    const workerIds = selectedWorkers.map((w) => w.id!).filter(Boolean);

    const payload: JobWorkflowStepCreateRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      orderIndex: nextOrderIndex,
      assignedWorkerIds: workerIds.length > 0 ? (new Set(workerIds) as any) : undefined,
      expectedDurationMinutes: expectedMinutes > 0 ? expectedMinutes : undefined,
      maximumDurationMinutes: maxMinutes > 0 ? maxMinutes : undefined,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error submitting add step:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <S.StyledDialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <S.ModalHeader>
          <S.ModalTitle>Add Step to Job Workflow</S.ModalTitle>
          <S.CloseButton size="small" onClick={handleClose} aria-label="Close add step modal">
            <CloseIcon fontSize="small" />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalContent>
          {/* Step Name */}
          <S.FormGroup>
            <S.FormLabel>Step Name *</S.FormLabel>
            <S.FormInput
              fullWidth
              size="small"
              placeholder="e.g., Initial Site Inspection"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </S.FormGroup>

          {/* Description */}
          <S.FormGroup>
            <S.FormLabel>Description</S.FormLabel>
            <S.FormInput
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Add details or instructions for this step..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </S.FormGroup>

          {/* Durations */}
          <S.DurationRow>
            {/* Expected duration */}
            <S.DurationFieldGroup>
              <S.FormLabel>Expected Duration</S.FormLabel>
              <S.DurationInputsBox>
                <S.SmallNumberInput
                  type="number"
                  size="small"
                  placeholder="0"
                  value={expectedDays}
                  onChange={(e) => setExpectedDays(e.target.value)}
                />
                <S.UnitLabel>days</S.UnitLabel>
                <S.SmallNumberInput
                  type="number"
                  size="small"
                  placeholder="0"
                  value={expectedHours}
                  onChange={(e) => setExpectedHours(e.target.value)}
                />
                <S.UnitLabel>hrs</S.UnitLabel>
              </S.DurationInputsBox>
            </S.DurationFieldGroup>

            {/* Maximum duration */}
            <S.DurationFieldGroup>
              <S.FormLabel>Maximum Duration</S.FormLabel>
              <S.DurationInputsBox>
                <S.SmallNumberInput
                  type="number"
                  size="small"
                  placeholder="0"
                  value={maxDays}
                  onChange={(e) => setMaxDays(e.target.value)}
                />
                <S.UnitLabel>days</S.UnitLabel>
                <S.SmallNumberInput
                  type="number"
                  size="small"
                  placeholder="0"
                  value={maxHours}
                  onChange={(e) => setMaxHours(e.target.value)}
                />
                <S.UnitLabel>hrs</S.UnitLabel>
              </S.DurationInputsBox>
            </S.DurationFieldGroup>
          </S.DurationRow>

          {/* Assignees */}
          <S.FormGroup>
            <S.FormLabel>Assign Workers</S.FormLabel>
            <Autocomplete
              multiple
              fullWidth
              size="small"
              options={allWorkers}
              value={selectedWorkers}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, newValue) => setSelectedWorkers(newValue)}
              disablePortal
              disableCloseOnSelect
              renderInput={(params) => (
                <S.FormInput
                  {...params}
                  placeholder={selectedWorkers.length === 0 ? 'Select workers...' : ''}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const tagProps = getTagProps({ index });
                  return (
                    <S.WorkerChip
                      {...tagProps}
                      key={tagProps.key}
                      label={option.name}
                      size="small"
                    />
                  );
                })
              }
            />
          </S.FormGroup>
        </S.ModalContent>

        <S.ModalActions>
          <S.CancelButton variant="outlined" onClick={handleClose} disabled={submitting}>
            Cancel
          </S.CancelButton>
          <S.SubmitButton type="submit" variant="contained" disabled={submitting || !name.trim()}>
            {submitting ? 'Adding...' : 'Add Step'}
          </S.SubmitButton>
        </S.ModalActions>
      </form>
    </S.StyledDialog>
  );
};

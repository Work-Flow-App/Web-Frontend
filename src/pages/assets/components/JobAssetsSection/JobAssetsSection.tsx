import React, { useState, useEffect, useCallback } from 'react';
import { Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Button } from '../../../../components/UI';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { assetService } from '../../../../services/api';
import type { AssetAssignmentResponse } from '../../../../services/api';
import { Loader } from '../../../../components/UI';
import { AssignAssetModal } from '../AssignAssetModal';
import * as S from './JobAssetsSection.styles';

export interface JobAssetsSectionProps {
  jobId: number;
}

export const JobAssetsSection: React.FC<JobAssetsSectionProps> = ({ jobId }) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [assignments, setAssignments] = useState<AssetAssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assetService.getJobAssignments(jobId, true);
      const assignmentsData = Array.isArray(response.data) ? response.data : [];
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching job assignments:', error);
      showError(extractErrorMessage(error, 'Failed to load asset assignments'));
    } finally {
      setLoading(false);
    }
  }, [jobId, showError]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAssignAsset = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'assignAsset',
      children: (
        <AssignAssetModal
          jobId={jobId}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchAssignments();
          }}
        />
      ),
    });
  };

  const handleReturnAsset = useCallback(
    (assignment: AssetAssignmentResponse) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'returnAsset',
        children: (
          <ConfirmationModal
            title="Return Asset"
            message="Are you sure you want to return this asset?"
            description="The asset will be marked as available and can be assigned to other jobs."
            variant="default"
            confirmButtonText="Return Asset"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await assetService.returnAsset({
                  assignmentId: assignment.assignmentId,
                  notes: undefined,
                });
                showSuccess('Asset returned successfully');
                resetGlobalModalOuterProps();
                fetchAssignments();
              } catch (error) {
                console.error('Error returning asset:', error);
                showError(extractErrorMessage(error, 'Failed to return asset'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
    },
    [showSuccess, showError, fetchAssignments, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  if (loading) {
    return <Loader />;
  }

  const formatMeta = (assignment: AssetAssignmentResponse): string => {
    const parts: string[] = [];
    if (assignment.assignedAt) {
      parts.push(`Assigned ${new Date(assignment.assignedAt).toLocaleDateString()}`);
    }
    if (assignment.durationDays !== undefined && assignment.durationDays !== null) {
      parts.push(`${assignment.durationDays} ${assignment.durationDays === 1 ? 'day' : 'days'}`);
    }
    if (assignment.serialNumber) {
      parts.push(`S/N ${assignment.serialNumber}`);
    }
    return parts.join('  ·  ');
  };

  return (
    <div>
      <S.SectionHeader>
        <S.SectionTitle>Assets on Job</S.SectionTitle>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAssignAsset}
          size="small"
          disabled={assignments.length > 0}
        >
          Assign Asset
        </Button>
      </S.SectionHeader>

      {assignments.length === 0 ? (
        <S.EmptyState>
          <S.EmptyStateIcon />
          <S.EmptyStateText>No assets assigned</S.EmptyStateText>
          <S.EmptyStateHint>Click &quot;Assign Asset&quot; to attach an asset to this job.</S.EmptyStateHint>
        </S.EmptyState>
      ) : (
        <Stack spacing={1}>
          {assignments.map((assignment) => (
            <S.AssetCard key={assignment.assignmentId}>
              <S.AssetIconBox>
                <S.AssetIconSmall />
              </S.AssetIconBox>

              <S.AssetContent>
                <S.AssetName>{assignment.assetName || `Asset #${assignment.assetId}`}</S.AssetName>
                <S.AssetMeta>{formatMeta(assignment)}</S.AssetMeta>
                {assignment.notes && <S.AssetNotes>{assignment.notes}</S.AssetNotes>}
              </S.AssetContent>

              <S.CardRight>
                <S.StatusChip label={assignment.status || 'Active'} size="small" color="success" />
                <Button variant="outlined" color="secondary" size="small" onClick={() => handleReturnAsset(assignment)}>
                  Return
                </Button>
              </S.CardRight>
            </S.AssetCard>
          ))}
        </Stack>
      )}
    </div>
  );
};

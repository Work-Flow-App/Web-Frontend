import React, { useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Button } from '../../../../components/UI';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { assetService } from '../../../../services/api';
import type { AssetAssignmentResponse } from '../../../../services/api';
import { useFetch } from '../../../../hooks';
import { Loader, Badge } from '../../../../components/UI';
import { AssignAssetModal } from '../AssignAssetModal';
import * as S from './JobAssetsSection.styles';

export interface JobAssetsSectionProps {
  jobId: number;
}

export const JobAssetsSection: React.FC<JobAssetsSectionProps> = ({ jobId }) => {
  const { showSuccess, showError } = useSnackbar();
  const { formatCurrency } = useCurrency();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const onAssignmentsError = useCallback(
    (error: unknown) => {
      console.error('Error fetching job assignments:', error);
      showError(extractErrorMessage(error, 'Failed to load asset assignments'));
    },
    [showError]
  );

  const {
    data: activeAssignments,
    loading: loadingActive,
    refetch: refetchActive,
  } = useFetch(() => assetService.getJobAssignments(jobId, true), [jobId], { onError: onAssignmentsError });

  // Only used to look up purchase price for the job-scoped "Total Value" stat
  const {
    data: allAssets,
    loading: loadingAssets,
    refetch: refetchAssets,
  } = useFetch(() => assetService.getAllAssets(0, 200), [], {
    onError: (error) => console.error('Failed to load assets for value calculation:', error),
  });

  const assignments = useMemo(() => activeAssignments ?? [], [activeAssignments]);

  // "Available" isn't meaningful scoped to a single job (an asset not on this job could be on
  // another job or in the warehouse) — everything currently assigned here is, by definition, in use.
  const stats = useMemo(() => {
    const assetsById = new Map((allAssets?.content ?? []).map((asset) => [asset.id, asset]));
    const activeAssetIds = Array.from(
      new Set(assignments.map((a) => a.assetId).filter((id): id is number => id != null))
    );
    const totalValue = activeAssetIds.reduce((sum, id) => sum + (assetsById.get(id)?.purchasePrice || 0), 0);

    return {
      total: assignments.length,
      inUse: assignments.length,
      available: 0,
      totalValue,
    };
  }, [assignments, allAssets]);

  const loading = loadingActive || loadingAssets;

  const refetchJobAssets = useCallback(() => {
    refetchActive();
    refetchAssets();
  }, [refetchActive, refetchAssets]);

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
            refetchJobAssets();
          }}
        />
      ),
    });
  };

  const handleEditAssignment = useCallback(
    (assignment: AssetAssignmentResponse) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'editAssignment',
        children: (
          <AssignAssetModal
            jobId={jobId}
            editAssignment={{
              assignmentId: assignment.assignmentId!,
              assetId: assignment.assetId!,
              assetName: assignment.assetName || `Asset #${assignment.assetId}`,
              assignedWorkerId: assignment.assignedWorkerId,
              notes: assignment.notes,
              locationType: assignment.locationType,
              address: assignment.address,
              expectedDurationDays: assignment.expectedDurationDays,
            }}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetchJobAssets();
            }}
          />
        ),
      });
    },
    [jobId, refetchJobAssets, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

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
                refetchJobAssets();
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
    [showSuccess, showError, refetchJobAssets, setGlobalModalOuterProps, resetGlobalModalOuterProps]
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
    if (assignment.expectedDurationDays !== undefined && assignment.expectedDurationDays !== null) {
      parts.push(`Expected ${assignment.expectedDurationDays} ${assignment.expectedDurationDays === 1 ? 'day' : 'days'}`);
    }
    if (assignment.serialNumber) {
      parts.push(`S/N ${assignment.serialNumber}`);
    }
    return parts.join('  ·  ');
  };

  return (
    <div>
      <S.StatsGrid>
        <S.StatCard>
          <S.StatHeader>
            <S.StatLabel>Total Assets</S.StatLabel>
            <S.StatIconContainer bgColor="rgba(33, 150, 243, 0.1)">
              <S.TotalAssetsIcon />
            </S.StatIconContainer>
          </S.StatHeader>
          <S.StatValue>{stats.total}</S.StatValue>
        </S.StatCard>

        <S.StatCard>
          <S.StatHeader>
            <S.StatLabel>Available</S.StatLabel>
            <S.StatIconContainer bgColor="rgba(76, 175, 80, 0.1)">
              <S.AvailableAssetsIcon />
            </S.StatIconContainer>
          </S.StatHeader>
          <S.StatValue>{stats.available}</S.StatValue>
        </S.StatCard>

        <S.StatCard>
          <S.StatHeader>
            <S.StatLabel>In Use</S.StatLabel>
            <S.StatIconContainer bgColor="rgba(255, 152, 0, 0.1)">
              <S.InUseAssetsIcon />
            </S.StatIconContainer>
          </S.StatHeader>
          <S.StatValue>{stats.inUse}</S.StatValue>
        </S.StatCard>

        <S.StatCard>
          <S.StatHeader>
            <S.StatLabel>Total Value</S.StatLabel>
            <S.StatIconContainer bgColor="rgba(156, 39, 176, 0.1)">
              <S.CostAssetsIcon />
            </S.StatIconContainer>
          </S.StatHeader>
          <S.StatValue>{formatCurrency(stats.totalValue)}</S.StatValue>
        </S.StatCard>
      </S.StatsGrid>

      <S.SectionHeader>
        <S.SectionTitle>Assets on Job</S.SectionTitle>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAssignAsset}
          size="small"
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
                {assignment.slaBreached && (
                  <Badge variant="error" size="small">
                    SLA Breached
                  </Badge>
                )}
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="primary" size="small" onClick={() => handleEditAssignment(assignment)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" size="small" onClick={() => handleReturnAsset(assignment)}>
                    Return
                  </Button>
                </Stack>
              </S.CardRight>
            </S.AssetCard>
          ))}
        </Stack>
      )}
    </div>
  );
};

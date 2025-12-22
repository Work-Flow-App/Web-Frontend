import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Stack } from '@mui/material';
import { Add as AddIcon, AssignmentReturn as ReturnIcon } from '@mui/icons-material';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { assetService } from '../../../../services/api';
import type { AssetAssignmentResponse } from '../../../../services/api';
import { Loader } from '../../../../components/UI';
import { AssignAssetModal } from '../AssignAssetModal';

export interface JobAssetsSectionProps {
  jobId: number;
}

export const JobAssetsSection: React.FC<JobAssetsSectionProps> = ({ jobId }) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [assignments, setAssignments] = useState<AssetAssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch job assignments
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assetService.getJobAssignments(jobId, true); // Only active assignments
      const assignmentsData = Array.isArray(response.data) ? response.data : [];
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching job assignments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load asset assignments';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobId, showError]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Handle assign asset
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

  // Handle return asset
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
                const errorMessage = error instanceof Error ? error.message : 'Failed to return asset';
                showError(errorMessage);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Assets on Job</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAssignAsset}
          size="small"
        >
          Assign Asset
        </Button>
      </Box>

      {assignments.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No assets assigned to this job yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <Card key={assignment.assignmentId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Asset ID: {assignment.assetId}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Assigned: ${assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : '-'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {assignment.assignedWorkerId && (
                        <Chip
                          label={`Worker ID: ${assignment.assignedWorkerId}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={assignment.status || 'Active'}
                        size="small"
                        color="success"
                      />
                    </Box>
                    {assignment.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Notes: {assignment.notes}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleReturnAsset(assignment)}
                    title="Return Asset"
                    size="small"
                  >
                    <ReturnIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

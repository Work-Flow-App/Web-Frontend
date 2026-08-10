import React, { useCallback, useMemo } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { assetService } from '../../../services/api';
import type { AssetAssignmentResponse } from '../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../components/UI/GlobalModal';
import { AssetAddressForm } from '../components/AssetAddressForm';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useFetch } from '../../../hooks';
import * as M from '../styles/WorkerMobile.styles';

interface AssetRow {
  assignmentId: number;
  assetId: number;
  assetName: string;
  serialNumber?: string;
  assetTag?: string;
  assignedAt?: string;
  expectedDurationDays?: number;
  slaBreached?: boolean;
  address?: AssetAssignmentResponse['address'];
}

const formatAddress = (addr?: AssetAssignmentResponse['address']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.postalCode, addr.country].filter(Boolean).join(', ');
};

const mapToRow = (a: AssetAssignmentResponse): AssetRow => ({
  assignmentId: a.assignmentId ?? 0,
  assetId: a.assetId ?? 0,
  assetName: a.assetName || `Asset #${a.assetId}`,
  serialNumber: a.serialNumber,
  assetTag: a.assetTag,
  assignedAt: a.assignedAt,
  expectedDurationDays: a.expectedDurationDays,
  slaBreached: a.slaBreached,
  address: a.address,
});

export const WorkerAssets: React.FC = () => {
  const { showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const { data, loading, refetch } = useFetch(() => assetService.getMyAssignedAssets(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load your assigned assets')),
  });

  const rows = useMemo((): AssetRow[] => (Array.isArray(data) ? data.map(mapToRow) : []), [data]);

  const handleViewDetails = useCallback(
    (row: AssetRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'viewAssetDetails',
        children: <AssetDetailModal assetId={row.assetId} assetName={row.assetName} />,
      });
    },
    [setGlobalModalOuterProps]
  );

  const handleEditAddress = useCallback(
    (row: AssetRow, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'editAssetAddress',
        children: (
          <AssetAddressForm
            assignmentId={row.assignmentId}
            assetName={row.assetName}
            currentAddress={row.address}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetch();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetch]
  );

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <h1>My Assets</h1>
      </M.WorkerHeader>

      {loading ? (
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      ) : rows.length === 0 ? (
        <M.EmptyState>
          <BuildOutlinedIcon />
          <span>No assets are currently assigned to you.</span>
        </M.EmptyState>
      ) : (
        <M.TaskList>
          {rows.map((row) => (
            <M.TaskCard key={row.assignmentId} accentColor="#2563EB" onClick={() => handleViewDetails(row)}>
              <M.TaskCardTopRow>
                <M.RefBadgeRow>
                  <M.RefBadge>{row.assetTag || `Asset #${row.assetId}`}</M.RefBadge>
                  {row.slaBreached && (
                    <M.StatusPill bg="rgba(244, 67, 54, 0.12)" fg="#C62828">
                      <WarningAmberOutlinedIcon sx={{ fontSize: 12 }} />
                      SLA Breached
                    </M.StatusPill>
                  )}
                </M.RefBadgeRow>
                <IconButton size="small" aria-label="Update asset address" onClick={(e) => handleEditAddress(row, e)}>
                  <EditLocationAltOutlinedIcon fontSize="small" />
                </IconButton>
              </M.TaskCardTopRow>

              <M.TaskTitle>{row.assetName}</M.TaskTitle>

              <M.InfoBlock>
                {(row.serialNumber || row.assetTag) && (
                  <M.InfoLine>
                    <BuildOutlinedIcon />
                    <span>{[row.serialNumber && `S/N ${row.serialNumber}`, row.assetTag].filter(Boolean).join(' · ')}</span>
                  </M.InfoLine>
                )}
                <M.InfoLine>
                  <LocationOnOutlinedIcon />
                  <span>{formatAddress(row.address) || 'No address set'}</span>
                </M.InfoLine>
                {row.assignedAt && (
                  <M.InfoLine>
                    <EventOutlinedIcon />
                    <span>
                      Assigned {new Date(row.assignedAt).toLocaleDateString()}
                      {row.expectedDurationDays != null &&
                        ` · expected ${row.expectedDurationDays} ${row.expectedDurationDays === 1 ? 'day' : 'days'}`}
                    </span>
                  </M.InfoLine>
                )}
              </M.InfoBlock>
            </M.TaskCard>
          ))}
        </M.TaskList>
      )}
    </M.WorkerShell>
  );
};

export default WorkerAssets;

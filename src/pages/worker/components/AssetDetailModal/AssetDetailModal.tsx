import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { assetService } from '../../../../services/api';
import type { AssetResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import * as M from '../../styles/WorkerMobile.styles';
import * as S from './AssetDetailModal.styles';

export interface AssetDetailModalProps {
  assetId: number;
  assetName?: string;
}

const formatAddress = (addr?: AssetResponse['address']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean).join(', ');
};

/**
 * Worker self-service: read-only full detail of an asset assigned to them
 * (description + attachments aren't included in the assignment list response,
 * so this is fetched on demand).
 */
export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ assetId, assetName }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const { showError } = useSnackbar();
  const [asset, setAsset] = useState<AssetResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateModalTitle(assetName || 'Asset Details');
    updateGlobalModalInnerConfig({ cancelButtonOnly: true, cancelButtonText: 'Close' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const response = await assetService.getMyAssignedAssetDetails(assetId);
        if (!cancelled) setAsset(response.data);
      } catch (error) {
        if (!cancelled) showError(extractErrorMessage(error, 'Failed to load asset details'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assetId, showError]);

  if (loading) {
    return (
      <M.LoadingBox>
        <CircularProgress size={28} />
      </M.LoadingBox>
    );
  }

  if (!asset) {
    return <S.EmptyText>Details are unavailable right now.</S.EmptyText>;
  }

  return (
    <S.DetailBody>
      {asset.description && (
        <M.AccordionBodyRow>
          <span className="label">Description</span>
          <span className="value">{asset.description}</span>
        </M.AccordionBodyRow>
      )}

      <M.AccordionBodyRow>
        <span className="label">Serial Number</span>
        <span className="value">{asset.serialNumber || '-'}</span>
      </M.AccordionBodyRow>

      <M.AccordionBodyRow>
        <span className="label">Asset Tag</span>
        <span className="value">{asset.assetTag || '-'}</span>
      </M.AccordionBodyRow>

      <M.AccordionBodyRow>
        <span className="label">Current Location</span>
        <span className="value">{formatAddress(asset.address) || 'Not set'}</span>
      </M.AccordionBodyRow>

      {asset.attachments && asset.attachments.length > 0 && (
        <M.AccordionBodyRow>
          <span className="label">Attachments</span>
          <S.AttachmentList>
            {asset.attachments.map((file, idx) => (
              <S.AttachmentLink key={file.fileUrl || idx} href={file.fileUrl} target="_blank" rel="noreferrer">
                <AttachFileOutlinedIcon fontSize="small" />
                {file.fileName || `Attachment ${idx + 1}`}
              </S.AttachmentLink>
            ))}
          </S.AttachmentList>
        </M.AccordionBodyRow>
      )}
    </S.DetailBody>
  );
};

import React, { useEffect, useMemo } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Badge } from '../../../../components/UI/Badge';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import type { FormTemplateRequest } from '../../../../services/api';
import { buildTemplateVersionChain } from '../../utils/templateVersionHistory';
import * as S from './VersionHistoryModal.styles';

export interface VersionHistoryModalProps {
  templateName: string;
  templateId: number;
  /** The full, unfiltered template list (including archived rows) already held by the list page. */
  allTemplates: FormTemplateRequest[];
}

/**
 * Read-only view of a template's version lineage. Editing a template archives it and creates a
 * new version server-side (see FormTemplateBuilderPage) - this reconstructs that chain from the
 * already-fetched template list so users can see what happened to earlier versions instead of
 * them silently disappearing from the main list.
 */
export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ templateName, templateId, allTemplates }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle(`Version History - ${templateName}`);
    updateGlobalModalInnerConfig({ cancelButtonOnly: true, cancelButtonText: 'Close' });
  }, [templateName, updateModalTitle, updateGlobalModalInnerConfig]);

  const chain = useMemo(() => buildTemplateVersionChain(allTemplates, templateId), [allTemplates, templateId]);

  if (chain.length === 0) {
    return <S.EmptyHint>No version history found for this template.</S.EmptyHint>;
  }

  return (
    <S.HistoryList>
      {[...chain].reverse().map((entry) => (
        <S.VersionRow key={entry.id} iscurrent={entry.archived ? 'false' : 'true'}>
          <S.VersionInfo>
            {entry.archived ? (
              <ArchiveIcon fontSize="small" color="disabled" />
            ) : (
              <CheckCircleIcon fontSize="small" color="success" />
            )}
            <S.VersionLabel>{`Version ${entry.version}`}</S.VersionLabel>
            <Badge variant={entry.archived ? 'default' : 'success'} size="small">
              {entry.archived ? 'Archived' : 'Current'}
            </Badge>
          </S.VersionInfo>
          <S.FieldCount>{`${entry.fieldCount} field${entry.fieldCount === 1 ? '' : 's'}`}</S.FieldCount>
        </S.VersionRow>
      ))}
    </S.HistoryList>
  );
};

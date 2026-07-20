import type { ITableColumn } from '../../../../../components/UI/Table/ITable';
import { Badge } from '../../../../../components/UI/Badge';
import type { CompanyDocumentResponse } from '../../../../../services/api';
import { CellStack, CellPrimaryText, CellSecondaryText } from './DocumentsTab.styles';

export interface DocumentTableRow extends CompanyDocumentResponse {
  id: number;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CERTIFICATE: 'Certificate',
  LICENSE: 'License',
  INSURANCE: 'Insurance',
  OTHER: 'Other',
};

const DOCUMENT_TYPE_VARIANTS: Record<string, 'primary' | 'secondary' | 'warning' | 'default'> = {
  CERTIFICATE: 'primary',
  LICENSE: 'secondary',
  INSURANCE: 'warning',
  OTHER: 'default',
};

const formatDate = (value?: string): string => (value ? new Date(value).toLocaleDateString() : '—');

export const createDocumentColumns = (): ITableColumn<DocumentTableRow>[] => [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    width: 'auto',
    render: (row) => (
      <CellStack>
        <CellPrimaryText>{row.title}</CellPrimaryText>
        {row.fileName && <CellSecondaryText>{row.fileName}</CellSecondaryText>}
      </CellStack>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    render: (row) => (
      <Badge variant={row.type ? DOCUMENT_TYPE_VARIANTS[row.type] : 'default'}>
        {row.type ? DOCUMENT_TYPE_LABELS[row.type] : '—'}
      </Badge>
    ),
  },
  {
    id: 'isPublic',
    label: 'Visibility',
    render: (row) => (
      <Badge variant={row.isPublic ? 'success' : 'default'}>{row.isPublic ? 'Public' : 'Private'}</Badge>
    ),
  },
  {
    id: 'validity',
    label: 'Validity',
    render: (row) =>
      row.validityStartDate || row.validityEndDate ? (
        <CellStack>
          <CellPrimaryText>{formatDate(row.validityStartDate)}</CellPrimaryText>
          <CellSecondaryText>to {formatDate(row.validityEndDate)}</CellSecondaryText>
        </CellStack>
      ) : (
        <CellSecondaryText>No expiry</CellSecondaryText>
      ),
  },
  {
    id: 'createdAt',
    label: 'Uploaded',
    sortable: true,
    render: (row) => formatDate(row.createdAt),
  },
];

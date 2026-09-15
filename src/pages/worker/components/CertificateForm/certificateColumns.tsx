import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { Badge } from '../../../../components/UI/Badge';
import { CERTIFICATE_TYPE_OPTIONS, CertificateType } from '../../../../services/api';
import type { CertificateResponse } from '../../../../services/api';
import { getCertificateStatus } from './certificateStatus';

export interface CertificateTableRow {
  id: number;
  name: string;
  type: CertificateResponse['type'];
  customTypeLabel: string;
  issuingAuthority: string;
  expiryDate: string;
  raw: CertificateResponse;
}

const typeLabel = (row: Pick<CertificateTableRow, 'type' | 'customTypeLabel'>) =>
  row.type === CertificateType.Other && row.customTypeLabel
    ? row.customTypeLabel
    : CERTIFICATE_TYPE_OPTIONS.find((opt) => opt.value === row.type)?.label || row.type;

export const createCertificateColumns = (): ITableColumn<CertificateTableRow>[] => [
  {
    id: 'name',
    label: 'Certificate',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'type',
    label: 'Type',
    width: 'auto',
    render: (row) => typeLabel(row),
  },
  {
    id: 'issuingAuthority',
    label: 'Issuing Authority',
    accessor: 'issuingAuthority',
    width: 'auto',
  },
  {
    id: 'expiryDate',
    label: 'Expiry Date',
    accessor: 'expiryDate',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'status',
    label: 'Status',
    width: 'auto',
    render: (row) => {
      const status = getCertificateStatus(row.raw);
      return (
        <Badge variant={status.variant} size="small">
          {status.label}
        </Badge>
      );
    },
  },
];

export const mapCertificateToRow = (cert: CertificateResponse): CertificateTableRow => ({
  id: cert.id,
  name: cert.name,
  type: cert.type,
  customTypeLabel: cert.customTypeLabel || '',
  issuingAuthority: cert.issuingAuthority || '-',
  expiryDate: cert.expiryDate || '-',
  raw: cert,
});

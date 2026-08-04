import type { ITableColumn } from '../../../components/UI/Table/ITable';
import { Badge } from '../../../components/UI/Badge';
import { CERTIFICATE_TYPE_OPTIONS } from '../../../services/api';
import type { CertificateResponse } from '../../../services/api';
import { getCertificateStatus } from '../../worker/components/CertificateForm';

export interface CompanyCertificateTableRow {
  id: number;
  workerId: number;
  workerName: string;
  name: string;
  type: CertificateResponse['type'];
  expiryDate: string;
  raw: CertificateResponse;
}

const typeLabel = (value: CertificateResponse['type']) =>
  CERTIFICATE_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value;

export const createCompanyCertificateColumns = (): ITableColumn<CompanyCertificateTableRow>[] => [
  {
    id: 'workerName',
    label: 'Worker',
    accessor: 'workerName',
    sortable: true,
    width: 'auto',
  },
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
    render: (row) => typeLabel(row.type),
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

export const mapCompanyCertificateToRow = (cert: CertificateResponse): CompanyCertificateTableRow => ({
  id: cert.id,
  workerId: cert.workerId,
  workerName: cert.workerName || `Worker #${cert.workerId}`,
  name: cert.name,
  type: cert.type,
  expiryDate: cert.expiryDate || '-',
  raw: cert,
});

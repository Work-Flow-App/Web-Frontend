import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import type { JobTemplateFieldResponse } from '../../../../services/api';
import { StatusChip } from './JobsList.styles';

const getStatusColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  const normalizedStatus = status?.toUpperCase() || '';
  switch (normalizedStatus) {
    case 'COMPLETED':
      return 'success';
    case 'IN_PROGRESS':
      return 'primary';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    case 'NEW':
    default:
      return 'default';
  }
};

export interface JobTableRow {
  id: number;
  jobRef?: number;
  templateId?: number;
  templateName?: string;
  workflowName?: string;
  customerId?: number;
  customerName?: string;
  clientId?: number;
  clientName?: string;
  status?: string;
  createdAt: string;
  fieldValues?: { [key: string]: string };
  assetIds?: number[];
  assetNames?: string;
  jobValue?: string;
  postCode?: string;
}

/**
 * Generate dynamic columns based on template fields
 */
export const generateJobColumns = (templateFields: JobTemplateFieldResponse[] = []): ITableColumn<JobTableRow>[] => {
  const baseColumns: ITableColumn<JobTableRow>[] = [
    {
      id: 'createdAt',
      label: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      width: 'auto',
      render: (row) => {
        if (!row.createdAt) return '-';
        try {
          // Format the date to a readable DD/MM/YYYY string
          return new Date(row.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        } catch {
          return row.createdAt;
        }
      },
    },
    {
      id: 'id',
      label: 'Job No',
      accessor: 'jobRef',
      sortable: true,
      width: 'auto',
      render: (row) => row.jobRef ?? row.id ?? '-',
    },
    {
      id: 'workflowName',
      label: 'Workfloow',
      accessor: 'workflowName',
      sortable: true,
      width: 'auto',
      render: (row) => row.workflowName || '-',
    },
    {
      id: 'customerName',
      label: 'Customer',
      accessor: 'customerName',
      sortable: true,
      width: 'auto',
      render: (row) => row.customerName || '-',
    },
    {
      id: 'clientName',
      label: 'Client',
      accessor: 'clientName',
      sortable: true,
      width: 'auto',
      render: (row) => row.clientName || '-',
    },
    {
      id: 'jobValue',
      label: 'Job value',
      accessor: 'jobValue',
      sortable: true,
      width: 'auto',
      render: (row) => row.jobValue || '-',
    },
    {
      id: 'postCode',
      label: 'Post Code',
      accessor: 'postCode',
      sortable: true,
      width: 'auto',
      render: (row) => row.postCode || '-',
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      sortable: true,
      width: 'auto',
      render: (row) => {
        const statusText = row.status || 'UNKNOWN';
        return <StatusChip label={statusText.replace(/_/g, ' ')} color={getStatusColor(statusText)} size="small" />;
      },
    },
  ];

  // Add dynamic columns from template fields
  const dynamicColumns: ITableColumn<JobTableRow>[] = templateFields.map((field) => ({
    id: `field_${field.id}`,
    label: field.label || field.name || '',
    sortable: false,
    width: 'auto',
    render: (row) => {
      const value = row.fieldValues?.[field.id?.toString() || ''];
      if (!value) return '-';

      // Format based on field type
      switch (field.jobFieldType) {
        case 'BOOLEAN':
          return value === 'true' ? 'Yes' : 'No';
        case 'DATE':
          try {
            return new Date(value).toLocaleDateString();
          } catch {
            return value;
          }
        default:
          return value;
      }
    },
  }));

  return [...baseColumns, ...dynamicColumns];
};

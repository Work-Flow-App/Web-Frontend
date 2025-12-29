import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import type { JobTemplateFieldResponse } from '../../../../services/api';

export interface JobTableRow {
  id: number;
  templateId?: number;
  templateName?: string;
  clientId?: number;
  clientName?: string;
  assignedWorkerId?: number;
  workerName?: string;
  status?: string;
  createdAt: string;
  fieldValues?: { [key: string]: string };
  assetIds?: number[];
  assetNames?: string;
}

/**
 * Generate dynamic columns based on template fields
 */
export const generateJobColumns = (templateFields: JobTemplateFieldResponse[] = []): ITableColumn<JobTableRow>[] => {
  const baseColumns: ITableColumn<JobTableRow>[] = [
    {
      id: 'id',
      label: 'Job ID',
      accessor: 'id',
      sortable: true,
      width: 'auto',
    },
    {
      id: 'templateName',
      label: 'Template',
      accessor: 'templateName',
      sortable: true,
      width: 'auto',
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
      id: 'workerName',
      label: 'Worker',
      accessor: 'workerName',
      sortable: true,
      width: 'auto',
      render: (row) => row.workerName || '-',
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      sortable: true,
      width: 'auto',
      render: (row) => row.status || '-',
    },
    {
      id: 'assetNames',
      label: 'Assets',
      accessor: 'assetNames',
      sortable: false,
      width: 'auto',
      render: (row) => row.assetNames || '-',
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

  const endColumns: ITableColumn<JobTableRow>[] = [
    {
      id: 'createdAt',
      label: 'Created',
      accessor: 'createdAt',
      sortable: true,
      width: 'auto',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return [...baseColumns, ...dynamicColumns, ...endColumns];
};

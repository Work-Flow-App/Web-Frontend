import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import type { JobTemplateFieldResponse } from '../../../../services/api';

export interface TemplateTableRow {
  id: number;
  name: string;
  description?: string;
  jobCount: number;
  createdAt: string;
  fieldValues?: { [key: string]: string };
}

/**
 * Generate dynamic columns based on template fields
 * Fields will appear as columns in the template table
 */
export const generateTemplateColumns = (
  templateFields: JobTemplateFieldResponse[] = []
): ITableColumn<TemplateTableRow>[] => {
  const baseColumns: ITableColumn<TemplateTableRow>[] = [
    {
      id: 'name',
      label: 'Template Name',
      accessor: 'name',
      sortable: true,
      width: 'auto',
    },
    {
      id: 'description',
      label: 'Description',
      accessor: 'description',
      sortable: false,
      width: 'auto',
      render: (row) => row.description || '-',
    },
  ];

  // Add dynamic columns from template fields
  const dynamicColumns: ITableColumn<TemplateTableRow>[] = templateFields.map((field) => ({
    id: `field_${field.name}`,
    label: field.label || field.name || '',
    sortable: false,
    width: 'auto',
    render: (row) => {
      const value = row.fieldValues?.[field.name || ''];
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

  const endColumns: ITableColumn<TemplateTableRow>[] = [
    {
      id: 'jobCount',
      label: '# of Jobs',
      accessor: 'jobCount',
      sortable: true,
      width: 'auto',
    },
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

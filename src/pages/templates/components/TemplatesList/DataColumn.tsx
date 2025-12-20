import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import type { JobTemplateFieldResponse } from '../../../../services/api';
import { Link } from '../../../../components/UI/Link';
import { FieldsBadgeList } from '../../../../components/UI/FieldsBadgeList';
import { FieldsContainer } from '../../../../components/UI/FieldsBadgeList/FieldsBadgeList.styles';
import { Badge } from '../../../../components/UI/Badge';

export interface TemplateTableRow {
  id: number;
  name: string;
  description?: string;
  jobCount: number;
  createdAt: string;
  fields?: JobTemplateFieldResponse[];
  isDefault?: boolean;
}

/**
 * Generate template columns with a single Fields column showing badges
 */
export const generateTemplateColumns = (
  onTemplateNameClick?: (templateId: number) => void
): ITableColumn<TemplateTableRow>[] => {
  const columns: ITableColumn<TemplateTableRow>[] = [
    {
      id: 'name',
      label: 'Template Name',
      accessor: 'name',
      sortable: true,
      width: 'auto',
      render: (row) => (
        <FieldsContainer>
          <Link onClick={() => onTemplateNameClick?.(row.id)}>
            {row.name}
          </Link>
          {row.isDefault && (
            <Badge variant="success" size="small">
              Default
            </Badge>
          )}
        </FieldsContainer>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      accessor: 'description',
      sortable: false,
      width: 'auto',
      render: (row) => row.description || '-',
    },
    {
      id: 'fields',
      label: 'Fields',
      sortable: false,
      width: 'auto',
      render: (row) => <FieldsBadgeList fields={row.fields || []} />,
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

  return columns;
};

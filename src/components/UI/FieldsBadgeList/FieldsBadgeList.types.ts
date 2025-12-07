export interface Field {
  label?: string;
  name?: string;
}

export interface FieldsBadgeListProps {
  fields: Field[];
  emptyText?: string;
}

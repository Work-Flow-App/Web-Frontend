import type { BadgeVariant } from '../components/UI/Badge';

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  CERTIFICATE: 'Certificate',
  LICENSE: 'License',
  INSURANCE: 'Insurance',
  OTHER: 'Other',
};

export const DOCUMENT_TYPE_VARIANTS: Record<string, BadgeVariant> = {
  CERTIFICATE: 'primary',
  LICENSE: 'secondary',
  INSURANCE: 'warning',
  OTHER: 'default',
};

export const getDocumentTypeLabel = (type?: string): string => (type ? DOCUMENT_TYPE_LABELS[type] || type : '—');

export const getDocumentTypeVariant = (type?: string): BadgeVariant =>
  (type ? DOCUMENT_TYPE_VARIANTS[type] : undefined) || 'default';

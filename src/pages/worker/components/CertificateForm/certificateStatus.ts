import type { CertificateResponse } from '../../../../services/api';
import type { BadgeVariant } from '../../../../components/UI/Badge/Badge.types';

export interface CertificateStatusInfo {
  label: string;
  variant: BadgeVariant;
}

export const getCertificateStatus = (cert: CertificateResponse): CertificateStatusInfo => {
  if (!cert.expiryDate) return { label: 'No Expiry', variant: 'default' };

  if (typeof cert.daysUntilExpiry === 'number' && cert.daysUntilExpiry < 0) {
    return { label: 'Expired', variant: 'error' };
  }

  if (cert.expiringSoon) {
    return {
      label: typeof cert.daysUntilExpiry === 'number' ? `Expires in ${cert.daysUntilExpiry}d` : 'Expiring Soon',
      variant: 'warning',
    };
  }

  return { label: 'Valid', variant: 'success' };
};

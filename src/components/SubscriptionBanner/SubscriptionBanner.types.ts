export interface SubscriptionBannerProps {
  className?: string;
}

export type AlertSeverity = 'info' | 'warning' | 'error';

export interface BannerConfig {
  severity: AlertSeverity;
  message: string;
  cta: string;
}
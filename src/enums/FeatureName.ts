export const FeatureName = {
  CONTACTS_MANAGER: 'Contacts Manager',
  JOB_TRACKING: 'Job Tracking',
  COLLABORATION: 'Collaboration',
} as const;

export type FeatureName = typeof FeatureName[keyof typeof FeatureName];

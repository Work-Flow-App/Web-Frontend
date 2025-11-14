import { FeatureName } from '../enums/FeatureName';

export const FEATURE_DESCRIPTIONS: Record<FeatureName, string> = {
  [FeatureName.CONTACTS_MANAGER]:
    'Keep all your important connections organized and accessible in one place. With Floow, you can create detailed profiles, link contacts to tasks or projects, and never lose track of who\'s involved.',
  [FeatureName.JOB_TRACKING]:
    'Keep all your jobs organized and visible in one place, With Floow. No more scattered notes or missed deadlines, everything you need stays right where you can see it.',
  [FeatureName.COLLABORATION]:
    'Work seamlessly with your team, assign tasks, share updates, and track responsibilities in a transparent way. Floow ensures everyone stays aligned, communication flows smoothly, and projects move forward without confusion.',
};

export const DEFAULT_AUTH_FEATURES = [
  {
    title: FeatureName.CONTACTS_MANAGER,
    description: FEATURE_DESCRIPTIONS[FeatureName.CONTACTS_MANAGER],
  },
  {
    title: FeatureName.JOB_TRACKING,
    description: FEATURE_DESCRIPTIONS[FeatureName.JOB_TRACKING],
  },
  {
    title: FeatureName.COLLABORATION,
    description: FEATURE_DESCRIPTIONS[FeatureName.COLLABORATION],
  },
];

export const DEFAULT_AUTH_TAGLINE = 'Turn chaos into clarity with smarter task management. Stay organized, stay ahead!';

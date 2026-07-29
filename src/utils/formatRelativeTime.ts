import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * LinkedIn-style relative timestamp: "2h ago", "3d ago", falling back to a
 * plain date once the post is more than a week old.
 */
export const formatRelativeTime = (value?: string): string => {
  if (!value) return '';
  const date = dayjs(value);
  if (!date.isValid()) return '';
  return Math.abs(dayjs().diff(date, 'day')) >= 7 ? date.format('D MMM YYYY') : date.fromNow();
};

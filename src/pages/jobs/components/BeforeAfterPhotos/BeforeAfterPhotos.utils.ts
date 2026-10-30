import type { StepAttachmentResponse, StepCommentResponse } from '../../../../services/api';

// The API has no before/after attachment types, so the photos are told apart by their description.
export const BEFORE_PHOTO = 'Before photo';
export const AFTER_PHOTO = 'After photo';

// First line of the step comment that holds the write-up; it's how the write-up is found among the step's comments.
const WRITE_UP_HEADING = 'Work carried out';

const toTime = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

/** The most recently uploaded attachment with this description, e.g. the current before photo. */
export const findLatestPhoto = (attachments: StepAttachmentResponse[], description: string) =>
  attachments
    .filter((attachment) => attachment.description === description)
    .reduce<StepAttachmentResponse | undefined>(
      (latest, attachment) => (!latest || toTime(attachment.createdAt) >= toTime(latest.createdAt) ? attachment : latest),
      undefined
    );

/** The current before and after photos, and every other attachment, including photos that were since replaced. */
export const splitAttachments = (attachments: StepAttachmentResponse[]) => {
  const before = findLatestPhoto(attachments, BEFORE_PHOTO);
  const after = findLatestPhoto(attachments, AFTER_PHOTO);
  return { before, after, others: attachments.filter((attachment) => attachment !== before && attachment !== after) };
};

/** "23 Sept 2026, 16:37" */
export const formatPhotoTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

/** "2h 45m" between the two times, or null if `to` isn't after `from`. */
export const formatDuration = (from?: string, to?: string) => {
  const minutes = Math.round((toTime(to) - toTime(from)) / 60_000);
  if (!from || !to || minutes < 0) return null;
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
};

/** The comment content for a write-up: a heading and the start and finish times, then the description. */
export const buildWriteUpComment = (startedAt: string | undefined, finishedAt: string | undefined, text: string) => {
  const duration = formatDuration(startedAt, finishedAt);
  return [
    WRITE_UP_HEADING,
    `Started: ${formatPhotoTime(startedAt)}`,
    `Finished: ${formatPhotoTime(finishedAt)}${duration ? ` (${duration})` : ''}`,
    '',
    text.trim(),
  ].join('\n');
};

/**
 * The description from the newest write-up comment posted no earlier than all the `since` times, or null if there's
 * none. Pass the photos' upload times: a write-up posted before a photo was replaced is out of date.
 */
export const findSavedWriteUp = (comments: StepCommentResponse[], ...since: (string | undefined)[]): string | null => {
  const notBefore = Math.max(0, ...since.map(toTime));
  const writeUp = comments
    .filter((comment) => comment.content?.split('\n', 1)[0].trim() === WRITE_UP_HEADING)
    .filter((comment) => toTime(comment.createdAt) >= notBefore)
    .sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))[0];
  if (!writeUp?.content) return null;
  // Drop the heading and times, which end at the first blank line.
  const [, ...body] = writeUp.content.split(/\n\s*\n/);
  return body.join('\n\n').trim();
};

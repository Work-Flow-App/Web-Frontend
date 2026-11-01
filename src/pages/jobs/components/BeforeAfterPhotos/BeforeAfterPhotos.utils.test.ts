import { describe, it, expect } from 'vitest';
import {
  AFTER_PHOTO,
  BEFORE_PHOTO,
  buildWriteUpComment,
  findLatestPhoto,
  findSavedWriteUp,
  formatDuration,
  formatPhotoTime,
  splitAttachments,
} from './BeforeAfterPhotos.utils';

// Local times without a zone, so the expected strings hold in any timezone.
const START = '2026-09-23T16:37:00';
const FINISH = '2026-09-23T19:22:00';

const attachments = [
  { id: 1, description: BEFORE_PHOTO, createdAt: '2026-09-23T09:00:00' },
  { id: 2, description: BEFORE_PHOTO, createdAt: '2026-09-23T10:00:00' },
  { id: 3, description: AFTER_PHOTO, createdAt: '2026-09-23T11:00:00' },
  { id: 4, fileName: 'site-plan.pdf', createdAt: '2026-09-23T12:00:00' },
];

describe('findLatestPhoto', () => {
  it('returns the newest attachment with the given description', () => {
    expect(findLatestPhoto(attachments, BEFORE_PHOTO)?.id).toBe(2);
    expect(findLatestPhoto(attachments, AFTER_PHOTO)?.id).toBe(3);
  });

  it('returns undefined when there is no such photo', () => {
    expect(findLatestPhoto([{ id: 4, fileName: 'site-plan.pdf' }], BEFORE_PHOTO)).toBeUndefined();
  });
});

describe('splitAttachments', () => {
  it('separates the current photos from the other files, keeping replaced photos with the files', () => {
    const { before, after, others } = splitAttachments(attachments);
    expect(before?.id).toBe(2);
    expect(after?.id).toBe(3);
    expect(others.map((attachment) => attachment.id)).toEqual([1, 4]);
  });
});

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(START, FINISH)).toBe('2h 45m');
  });

  it('formats under an hour as minutes only', () => {
    expect(formatDuration(START, '2026-09-23T17:05:00')).toBe('28m');
  });

  it('returns null when the finish is before the start or a time is missing', () => {
    expect(formatDuration(FINISH, START)).toBeNull();
    expect(formatDuration(START, undefined)).toBeNull();
  });
});

describe('buildWriteUpComment and findSavedWriteUp', () => {
  const text = 'Desk cleared.\n\n• Papers stacked\n• Floor swept';

  it('writes the heading, times and duration above the description', () => {
    expect(buildWriteUpComment(START, FINISH, text)).toBe(
      `Work carried out\nStarted: ${formatPhotoTime(START)}\nFinished: ${formatPhotoTime(FINISH)} (2h 45m)\n\n${text}`
    );
  });

  it('reads back the description of the newest write-up', () => {
    const comments = [
      { id: 1, content: buildWriteUpComment(START, FINISH, 'Old summary'), createdAt: '2026-09-23T19:30:00' },
      { id: 2, content: buildWriteUpComment(START, FINISH, text), createdAt: '2026-09-23T19:40:00' },
      { id: 3, content: 'Customer asked about the invoice', createdAt: '2026-09-23T19:50:00' },
    ];
    expect(findSavedWriteUp(comments, START, FINISH)).toBe(text);
  });

  it('ignores write-ups posted before a photo was replaced', () => {
    const comments = [{ id: 1, content: buildWriteUpComment(START, FINISH, text), createdAt: '2026-09-23T19:30:00' }];
    expect(findSavedWriteUp(comments, '2026-09-23T20:00:00', FINISH)).toBeNull();
  });
});

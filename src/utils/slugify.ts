/**
 * Converts a display name into a URL-friendly slug for cosmetic/marketing use in links
 * (e.g. `/public/company/2/ifta-s-company`). The slug is decorative only — callers must
 * keep resolving the real record from the numeric id alongside it, since nothing looks
 * up records by slug.
 */
export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

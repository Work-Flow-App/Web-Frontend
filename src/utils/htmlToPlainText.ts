/**
 * Reads rich-text HTML as plain text for short previews. Nothing in the markup
 * loads or runs: a DOMParser document is inert, and the result is only ever
 * rendered as text.
 */
export function htmlToPlainText(html: string): string {
  // textContent runs adjacent blocks together, so keep them apart first
  const spaced = html.replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, '$& ');
  const text = new DOMParser().parseFromString(spaced, 'text/html').body.textContent ?? '';
  return text.replace(/\s+/g, ' ').trim();
}

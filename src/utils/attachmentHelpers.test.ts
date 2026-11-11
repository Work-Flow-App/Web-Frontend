import { describe, expect, it } from 'vitest';
import { getFileExtensionLabel, getFileKind } from './attachmentHelpers';

describe('getFileKind', () => {
  it.each([
    ['image/jpeg', 'site.jpeg', 'image'],
    [undefined, 'photo.PNG', 'image'],
    ['application/pdf', 'quote', 'pdf'],
    [undefined, 'Dep_Resume.pdf', 'pdf'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'notes', 'word'],
    [undefined, 'report.doc', 'word'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'costs', 'sheet'],
    [undefined, 'export.csv', 'sheet'],
    ['video/mp4', 'walkthrough', 'video'],
    ['application/zip', 'bundle.zip', 'other'],
    [undefined, undefined, 'other'],
  ])('reads %s / %s as %s', (fileType, fileName, kind) => {
    expect(getFileKind(fileType, fileName)).toBe(kind);
  });

  it('trusts the file type over a misleading extension for images', () => {
    expect(getFileKind('image/png', 'scan.pdf')).toBe('image');
  });
});

describe('getFileExtensionLabel', () => {
  it('upper-cases the extension and falls back to FILE', () => {
    expect(getFileExtensionLabel('Dep_Resume.pdf')).toBe('PDF');
    expect(getFileExtensionLabel('no-extension')).toBe('NO-EXTENSION');
    expect(getFileExtensionLabel(undefined)).toBe('FILE');
  });
});

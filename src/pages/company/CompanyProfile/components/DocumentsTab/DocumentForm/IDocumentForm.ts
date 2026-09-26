export interface DocumentFormValues {
  title: string;
  type: string;
  description: string;
  validityStartDate: string;
  validityEndDate: string;
  isPublic: boolean;
  /** Newly chosen file; null keeps the existing file when editing. */
  file: File | null;
}

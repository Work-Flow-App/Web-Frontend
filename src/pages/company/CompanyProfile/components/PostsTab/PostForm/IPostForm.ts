export interface PostFormValues {
  content: string;
  isPublic: boolean;
  /** Post group; null when the post isn't in a group. */
  groupId: number | null;
}

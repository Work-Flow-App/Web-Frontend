export type AddMemberFormData = {
  /**
   * Email address of the member to invite
   */
  email: string;

  /**
   * Role to assign to the member
   */
  role: string;
};

export type AddMemberScreenProps = {
  /**
   * Available roles for selection
   */
  roles?: { label: string; value: string }[];

  /**
   * Callback when invitation is sent successfully
   */
  onInvite?: (data: AddMemberFormData) => void | Promise<void>;
};

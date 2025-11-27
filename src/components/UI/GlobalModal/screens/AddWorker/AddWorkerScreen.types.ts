export interface AddWorkerFormData {
  name: string;
  initials?: string;
  email: string;
  telephone?: string;
  mobile?: string;
  username: string;
  password: string;
}

export interface AddWorkerScreenProps {
  onInvite?: (data: AddWorkerFormData) => Promise<void> | void;
}

export interface UserProfile {
  id: string;
  displayName: string;
  roleTitle: string;
  initials: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
}

export interface ProfileFormValues {
  name: string;
  email: string;
  organization: string;
  phone: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

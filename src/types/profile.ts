export interface UserProfile {
  initials: string;
  name: string;
  email: string;
}

export interface ProfileFormValues {
  name: string;
  email: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

export interface UserProfile {
  initials: string;
  name: string;
  email: string;
}

export interface ProfileFormValues {
  name: string;
  email: string;
  // Vazios significam "manter a senha atual".
  password: string;
  confirmPassword: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

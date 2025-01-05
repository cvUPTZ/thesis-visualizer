export type User = {
  id: string;
  email?: string | null;
  role?: string | null;
};

export type SignInResponse = {
  user: User;
  userRole: string;
};
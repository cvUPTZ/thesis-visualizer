export type User = {
  id: string;
  email?: string; // Made optional to match Supabase User type
  role: string | null;
};

export type SignInResponse = {
  user: User;
  userRole: string;
};
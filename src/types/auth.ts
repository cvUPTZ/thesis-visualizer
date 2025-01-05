import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  email?: string | null;
  role?: string | null;
};

export type SignInResponse = {
  user: User;
  userRole: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (credentials: { email: string; password: string }) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
};
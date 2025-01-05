import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser & {
  role?: string;
};

export type AuthError = {
  message: string;
  status?: number;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  userRole: string | null;
};
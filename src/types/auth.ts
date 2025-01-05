import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser & {
  role?: string | null;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  userRole: string | null;
};

export type AuthContextType = AuthState & {
  logout: () => Promise<void>;
};
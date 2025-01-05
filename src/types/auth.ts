import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type User = SupabaseUser & {
  role?: string | null;
};

export type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userId?: string;
  userEmail?: string;
};

export type AuthContextType = AuthState & {
  logout: () => Promise<void>;
};
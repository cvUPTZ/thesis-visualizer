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
  userRole: string;
  userId: string | null;
  userEmail: string | null;
};

export type AuthContextType = AuthState & {
  signOut: () => Promise<void>;
};
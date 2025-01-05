export type User = {
  id: string;
  email: string | undefined;  // Making email optional to match Supabase User type
  role: string | null;
};

export type AuthContextType = {
  user: User | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export type SignInResponse = {
  user: User;
  userRole: string;
};
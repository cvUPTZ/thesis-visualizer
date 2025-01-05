export interface User {
  id: string;
  email: string;
  role: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
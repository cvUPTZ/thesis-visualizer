export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  userRole?: string;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  clearError: () => void;
}
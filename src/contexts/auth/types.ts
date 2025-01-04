export interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
}
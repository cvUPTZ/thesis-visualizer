export interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
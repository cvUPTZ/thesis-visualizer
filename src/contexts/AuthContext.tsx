import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string;
  userId: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: '',
  userId: null,
  userEmail: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signOut: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('Rendering AuthProvider with simplified auth');
  
  return (
    <AuthContext.Provider 
      value={{
        user: null,
        session: null,
        userRole: '',
        userId: null,
        userEmail: null,
        isAuthenticated: true, // Temporarily set to true to prevent blocking
        isLoading: false,
        error: null,
        signOut: async () => {},
        logout: async () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
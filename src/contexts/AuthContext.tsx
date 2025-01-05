import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        console.log('🔐 Initializing auth session...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          return;
        }

        console.log('✅ Initial session loaded:', initialSession?.user?.email);
        setSession(initialSession);
      } catch (error) {
        console.error('❌ Error in session initialization:', error);
      }
    };

    initSession();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event, session?.user?.email);
      setSession(session);
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('🔄 Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during logout:', error);
        throw error;
      }
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Error in logout process:', error);
      throw error;
    }
  };

  const value = {
    session,
    isAuthenticated: !!session?.user,
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    logout,
  };

  console.log('🔐 Auth state:', value.isAuthenticated);
  
  return (
    <AuthContext.Provider value={value}>
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
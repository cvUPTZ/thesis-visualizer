import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  useEffect(() => {
    const initSession = async () => {
      try {
        console.log('🔐 Initializing auth session...');
        
        // Get stored session
        const { data: { session: storedSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting stored session:', sessionError);
          return;
        }

        if (storedSession) {
          console.log('✅ Stored session found:', storedSession.user?.email);
          setSession(storedSession);
        } else {
          console.log('ℹ️ No stored session found');
        }

      } catch (error) {
        console.error('❌ Error in session initialization:', error);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔄 Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', currentSession?.user?.email);
        setSession(currentSession);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setSession(null);
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
        setSession(currentSession);
      } else if (event === 'USER_UPDATED') {
        console.log('👤 User updated');
        setSession(currentSession);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    try {
      console.log('🔄 Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during logout:', error);
        throw error;
      }
      console.log('✅ Logged out successfully');
      navigate('/auth');
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
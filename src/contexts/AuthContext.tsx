import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  handleLogout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError, context: string) => {
    console.error(`❌ Auth error in ${context}:`, error);
    
    // Don't show errors for expected cases
    if (error.message.includes('session_not_found') || 
        error.message.includes('refresh_token_not_found')) {
      return;
    }

    toast({
      title: "Authentication Error",
      description: error.message,
      variant: "destructive",
    });
  };

  const clearAuthState = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        console.log('🔄 Initializing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          handleAuthError(sessionError, 'session initialization');
          setLoading(false);
          return;
        }

        if (session) {
          console.log('✅ Session found:', session.user.email);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          
          if (location.pathname === '/auth') {
            navigate('/');
          }
        } else {
          console.log('ℹ️ No active session');
          clearAuthState();
          if (location.pathname !== '/auth' && location.pathname !== '/') {
            navigate('/auth');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email);
        if (location.pathname === '/auth') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        clearAuthState();
        navigate('/auth');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    console.log('🔄 Starting logout process...');
    setLoading(true);
    
    try {
      // First clear local state
      clearAuthState();
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        handleAuthError(error, 'logout');
      } else {
        console.log('✅ Logout successful');
        toast({
          title: "Success",
          description: "You have been signed out successfully",
        });
      }
    } catch (error: any) {
      console.error('❌ Unexpected error during logout:', error);
      handleAuthError(error, 'logout');
    } finally {
      setLoading(false);
      navigate('/auth');
    }
  };

  const value = {
    isAuthenticated,
    userId,
    userEmail,
    handleLogout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
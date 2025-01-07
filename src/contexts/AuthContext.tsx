import { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useSessionManager } from '@/hooks/useSessionManager';

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
  const { authState, setters, clearAuthState } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError, context: string) => {
    console.error(`❌ Auth error in ${context}:`, error);
    
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

  const handleLogout = async () => {
    console.log('🔄 Starting logout process...');
    setters.setLoading(true);
    
    try {
      if (authState.userId) {
        await cleanupSession(authState.userId);
      }
      
      clearAuthState();
      
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
      setters.setLoading(false);
      navigate('/auth');
    }
  };

  const { manageActiveSession, cleanupSession } = useSessionManager(handleLogout);

  useEffect(() => {
    let isMounted = true;  // Add mounted flag
    
    const initSession = async () => {
      try {
        console.log('🔄 Initializing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;  // Check if component is still mounted

        if (sessionError) {
          handleAuthError(sessionError, 'session initialization');
          setters.setLoading(false);
          return;
        }

        if (session) {
          console.log('✅ Session found:', session.user.email);
          
          const sessionValid = await manageActiveSession(session);
          
          if (!isMounted) return;  // Check if component is still mounted

          if (!sessionValid) {
            clearAuthState();
            setters.setLoading(false);
            return;
          }

          setters.setIsAuthenticated(true);
          setters.setUserId(session.user.id);
          setters.setUserEmail(session.user.email);
          
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
        if (isMounted) {  // Only update loading if still mounted
          setters.setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        if (isMounted) {  // Only update loading if still mounted
          setters.setLoading(false);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        const sessionValid = await manageActiveSession(session);
        
        if (!isMounted) return;  // Check if component is still mounted

        if (!sessionValid) {
          clearAuthState();
          return;
        }

        setters.setIsAuthenticated(true);
        setters.setUserId(session.user.id);
        setters.setUserEmail(session.user.email);
        setters.setLoading(false);  // Make sure to set loading to false after sign in
        if (location.pathname === '/auth') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (authState.userId) {
          await cleanupSession(authState.userId);
        }
        clearAuthState();
        setters.setLoading(false);  // Make sure to set loading to false after sign out
        navigate('/auth');
      }
    });

    return () => {
      isMounted = false;  // Update mounted flag
      console.log('🧹 Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const value = {
    ...authState,
    handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
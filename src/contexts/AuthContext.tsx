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

  const handleSessionConflict = async () => {
    console.log('🔄 Session conflict detected, logging out...');
    await handleLogout();
    toast({
      title: "Session Conflict",
      description: "Your account is already active in another browser. You've been logged out.",
      variant: "destructive",
    });
  };

  const manageActiveSession = async (sessionId: string, userId: string) => {
    try {
      console.log('🔄 Managing active session...');
      
      // Check for existing sessions
      const { data: existingSessions, error: checkError } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', userId);

      if (checkError) throw checkError;

      if (existingSessions && existingSessions.length > 0) {
        const existingSession = existingSessions[0];
        
        // If different session exists, handle conflict
        if (existingSession.session_id !== sessionId) {
          console.log('❌ Session conflict detected');
          await handleSessionConflict();
          return false;
        }

        // Update last_seen for existing session
        const { error: updateError } = await supabase
          .from('active_sessions')
          .update({ last_seen: new Date().toISOString() })
          .eq('session_id', sessionId);

        if (updateError) throw updateError;
      } else {
        // Create new session record
        const { error: insertError } = await supabase
          .from('active_sessions')
          .insert([
            { user_id: userId, session_id: sessionId }
          ]);

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('❌ Error managing active session:', error);
      return false;
    }
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
          
          // Manage active session
          const sessionValid = await manageActiveSession(session.id, session.user.id);
          
          if (!sessionValid) {
            clearAuthState();
            setLoading(false);
            return;
          }

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
        const sessionValid = await manageActiveSession(session.id, session.user.id);
        
        if (!sessionValid) {
          clearAuthState();
          return;
        }

        setIsAuthenticated(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email);
        if (location.pathname === '/auth') {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Clean up active session on sign out
        if (userId) {
          await supabase
            .from('active_sessions')
            .delete()
            .eq('user_id', userId);
        }
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
      if (userId) {
        // Clean up active session
        await supabase
          .from('active_sessions')
          .delete()
          .eq('user_id', userId);
      }
      
      // Clear local state
      clearAuthState();
      
      // Sign out from Supabase
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
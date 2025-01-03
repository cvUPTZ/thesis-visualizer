import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { Session, User, AuthError, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userRole: string | null;
  userId: string | null;
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userRole: null,
  userId: null,
  user: null,
  session: null,
  signOut: async () => {},
});

const fetchUserRole = async (userId: string) => {
  console.log(`Fetching user role for user ID: ${userId}`);
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        role_id,
        roles (
          name
        )
      `)
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    
    console.log(`Fetched user role: ${profile?.roles?.name || null}`);
    return profile?.roles?.name || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useNotification();

  const handleAuthError = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUser(null);
    setSession(null);
    navigate('/auth', { replace: true });
  };

  const updateAuthState = async (currentSession: Session | null, showToast = false) => {
    try {
      if (!currentSession?.user) {
        handleAuthError();
        return;
      }

      const role = await fetchUserRole(currentSession.user.id);
      setSession(currentSession);
      setUser(currentSession.user);
      setIsAuthenticated(true);
      setUserId(currentSession.user.id);
      setUserRole(role);

      if (showToast) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      handleAuthError();
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted && session) {
          await updateAuthState(session);
        } else if (mounted) {
          handleAuthError();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) handleAuthError();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        try {
          switch (event) {
            case 'SIGNED_IN':
              await updateAuthState(currentSession, true);
              navigate('/dashboard', { replace: true });
              break;
            case 'SIGNED_OUT':
              handleAuthError();
              break;
            case 'TOKEN_REFRESHED':
              if (currentSession) {
                await updateAuthState(currentSession);
              } else {
                handleAuthError();
              }
              break;
            case 'USER_UPDATED':
              if (currentSession) {
                await updateAuthState(currentSession);
              }
              break;
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          handleAuthError();
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been signed out successfully."
      });
      
      handleAuthError();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        loading, 
        userRole, 
        userId, 
        user,
        session,
        signOut 
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
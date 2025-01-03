import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { Session, User } from '@supabase/supabase-js';

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

    if (profileError) {
      console.error('Error fetching user role:', profileError);
      throw profileError;
    }
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

  const updateAuthState = async (currentSession: Session | null, showToast = false) => {
    console.log('Updating auth state with session:', currentSession?.user?.email);
    if (!currentSession?.user) {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setUser(null);
      setSession(null);
      console.log('No user in session. Auth state reset.');
      return;
    }

    try {
      const role = await fetchUserRole(currentSession.user.id);
      setSession(currentSession);
      setUser(currentSession.user);
      setIsAuthenticated(true);
      setUserId(currentSession.user.id);
      setUserRole(role);
      console.log('Auth state updated successfully:', { user: currentSession.user.email, role });

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

  const handleAuthError = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUser(null);
    setSession(null);
    navigate('/auth', { replace: true });
    toast({
      title: "Authentication error",
      description: "Please sign in again",
      variant: "destructive"
    });
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('Initializing auth state...');
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session", error);
          throw error;
        }

        if (mounted) {
          if (session) {
            console.log('Session found:', session.user.email);
            await updateAuthState(session);
          } else {
            console.log('No session found');
            handleAuthError();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          handleAuthError();
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Auth initialization complete');
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        console.log('Auth state changed:', event);
        
        try {
          setLoading(true);
          
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
                console.log('Token refreshed, updating auth state');
                await updateAuthState(currentSession);
              } else {
                console.log('Token refresh failed, no session');
                handleAuthError();
              }
              break;
            case 'USER_DELETED':
            case 'USER_UPDATED':
              if (currentSession) {
                await updateAuthState(currentSession);
              }
              break;
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          handleAuthError();
        } finally {
          if (mounted) {
            setLoading(false);
          }
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
    console.log('Attempting sign out');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been signed out successfully."
      });
      
      handleAuthError();
      console.log('Sign out complete');
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
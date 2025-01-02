// src/contexts/AuthContext.tsx
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useNotification();

  const fetchUserRole = async (userId: string) => {
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
      
      return profile?.roles?.name || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (currentSession?.user && mounted) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          setUserId(currentSession.user.id);
          
          const userRole = await fetchUserRole(currentSession.user.id);
          
          if (mounted) {
            setUserRole(userRole);
          }
        } else if (mounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserId(null);
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserId(null);
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (mounted) {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (event === 'SIGNED_IN' && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          setUserId(currentSession.user.id);
          
          const userRole = await fetchUserRole(currentSession.user.id);
          setUserRole(userRole);
          setLoading(false);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserId(null);
          setUser(null);
          setSession(null);
          setLoading(false);
          navigate('/auth', { replace: true });
        }
      }
    });

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
      navigate('/auth', { replace: true });
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

export const useAuth = () => useContext(AuthContext);
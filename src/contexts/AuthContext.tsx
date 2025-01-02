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
      console.log('Fetching user role for:', userId);
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
      
      console.log('Fetched profile:', profile);
      return profile?.roles?.name || null;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider mounted, initializing...');

    const checkUser = async () => {
      try {
        console.log('Checking user session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        if (currentSession?.user && mounted) {
          console.log('Active session found:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          setUserId(currentSession.user.id);
          
          const userRole = await fetchUserRole(currentSession.user.id);
          
          if (mounted) {
            setUserRole(userRole);
            console.log('User role set:', userRole);
          }
        } else if (mounted) {
          console.log('No active session found');
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
          console.log('Initial auth check complete');
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN' && currentSession) {
        setLoading(true);
        try {
          console.log('Processing sign in for:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          setUserId(currentSession.user.id);
          
          const userRole = await fetchUserRole(currentSession.user.id);
          setUserRole(userRole);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
        } catch (error) {
          console.error('Error processing sign in:', error);
          toast({
            title: "Error",
            description: "There was an error signing in. Please try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
        setUser(null);
        setSession(null);
        setLoading(false);
        navigate('/auth', { replace: true });
      }
    });

    checkUser();

    return () => {
      console.log('AuthProvider unmounting, cleaning up...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
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
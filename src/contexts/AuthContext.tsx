import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userId: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userId: null,
  userRole: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          toast({
            title: 'Authentication Error',
            description: 'There was an error checking your authentication status.',
            variant: 'destructive',
          });
          return;
        }

        if (session) {
          console.log('Session verified successfully');
          setIsAuthenticated(true);
          setUserId(session.user.id);

          // Fetch user role from profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user role:', profileError);
          } else {
            setUserRole(profile?.role || null);
          }
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);

        // Fetch user role when signed in
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user role:', profileError);
        } else {
          setUserRole(profile?.role || null);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserId(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userId, userRole }}>
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
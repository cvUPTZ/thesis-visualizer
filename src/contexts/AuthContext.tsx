import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
  userRole: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('🔍 Fetching user role for:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          roles (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching user role:', error);
        throw error;
      }

      const roleName = profile?.roles?.name || null;
      console.log('✅ User role fetched:', roleName);
      return roleName;
    } catch (error) {
      console.error('❌ Error in fetchUserRole:', error);
      throw error;
    }
  };

  const handleSessionChange = async (session: any) => {
    console.log('🔄 Handling session change:', session?.user?.email);
    setLoading(true);
    try {
      if (session?.user) {
        setUserId(session.user.id);
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
        console.log('✅ Session updated successfully with role:', role);
      } else {
        setUserId(null);
        setUserRole(null);
        console.log('ℹ️ Session cleared');
      }
    } catch (error) {
      console.error('❌ Error handling session change:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('🔍 Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user && mounted) {
          console.log('✅ Session found for user:', session.user.email);
          await handleSessionChange(session);
        } else {
          console.log('ℹ️ No active session');
          if (mounted) {
            setUserId(null);
            setUserRole(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setUserId(null);
          setUserRole(null);
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping state update');
        return;
      }

      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', session?.user?.email);
        await handleSessionChange(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUserId(null);
        setUserRole(null);
        setLoading(false);
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed for user:', session?.user?.email);
        await handleSessionChange(session);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth state listener...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting logout process...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      console.log('✅ Logout successful');
      setUserId(null);
      setUserRole(null);
      
      navigate('/auth');
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error: any) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      userId, 
      loading, 
      logout,
      isAuthenticated: !!userId,
      userRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
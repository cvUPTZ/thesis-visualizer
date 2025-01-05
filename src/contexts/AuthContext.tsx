import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { useSession } from './auth/useSession';
import { useToast } from '@/hooks/use-toast';
import { useAuthMutations } from '@/hooks/auth/useAuthMutations';

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userEmail: null,
  userRole: null,
  loading: true,
  isLoading: true,
  error: null,
  signInError: null,
  isAuthenticated: false,
  user: null,
  logout: async () => {},
  signOut: async () => {},
  setUserId: () => {},
  setUserEmail: () => {},
  setUserRole: () => {},
  setLoading: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuthMutations();
  const {
    userId,
    userEmail,
    userRole,
    loading,
    handleSessionChange,
    setUserId,
    setUserEmail,
    setUserRole,
    setLoading
  } = useSession();

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    let mounted = true;

    const checkSession = async () => {
      if (!mounted) return;

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
          console.log('ℹ️ No active session found');
          if (mounted) {
            setUserId(null);
            setUserEmail(null);
            setUserRole(null);
            navigate('/auth');
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
          setLoading(false);
          navigate('/auth');
          toast({
            title: "Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping state update');
        return;
      }

      try {
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in:', session?.user?.email);
          await handleSessionChange(session);
          // Add delay before reload to ensure navigation and toast are visible
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
          setLoading(false);
          navigate('/auth');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed for user:', session?.user?.email);
          await handleSessionChange(session);
        }
      } catch (error) {
        console.error('❌ Error handling auth state change:', error);
        toast({
          title: "Error",
          description: "Failed to update authentication state",
          variant: "destructive",
        });
      }
    });

    checkSession();

    return () => {
      console.log('🧹 Cleaning up auth state listener...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, handleSessionChange, setUserId, setUserEmail, setUserRole, setLoading, toast]);

  const user = userId ? { id: userId, email: userEmail, role: userRole } : null;

  return (
    <AuthContext.Provider value={{ 
      userId, 
      userEmail,
      userRole,
      loading,
      isLoading: loading,
      error: null,
      signInError: null,
      isAuthenticated: !!userId,
      user,
      logout: signOut,
      signOut,
      setUserId,
      setUserEmail,
      setUserRole,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
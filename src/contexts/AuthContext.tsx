import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useSession } from './auth/useSession';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
  userRole: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    userRole,
    loading,
    handleSessionChange,
    logout,
    setUserId,
    setUserRole,
    setLoading
  } = useSession();

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
      console.log('📦 Loading auth state from localStorage:', savedState);
      const { userId: savedUserId, userRole: savedUserRole } = JSON.parse(savedState);
      if (savedUserId && savedUserRole) {
        console.log('✅ Restored auth state:', { userId: savedUserId, userRole: savedUserRole });
        setUserId(savedUserId);
        setUserRole(savedUserRole);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (userId && userRole) {
      console.log('💾 Saving auth state to localStorage:', { userId, userRole });
      localStorage.setItem('authState', JSON.stringify({ userId, userRole }));
    } else {
      console.log('🗑️ Clearing auth state from localStorage');
      localStorage.removeItem('authState');
    }
  }, [userId, userRole]);

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
            setUserRole(null);
            navigate('/welcome');
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setUserId(null);
          setUserRole(null);
          setLoading(false);
          navigate('/welcome');
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
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUserId(null);
          setUserRole(null);
          setLoading(false);
          localStorage.removeItem('authState');
          navigate('/welcome');
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

    // Initial session check
    checkSession();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up auth state listener...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

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
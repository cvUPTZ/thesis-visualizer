import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useSession } from './auth/useSession';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => { },
  isAuthenticated: false,
  userRole: null,
  setLoading: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    userRole,
    loading: sessionLoading,
    handleSessionChange,
    logout,
    setUserId,
    setUserRole,
    setLoading: setSessionLoading
  } = useSession();
  const [authLoading, setAuthLoading] = useState(true);

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
  }, [setUserId, setUserRole]);

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
    setAuthLoading(sessionLoading);
  }, [sessionLoading]);

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
          console.log('ℹ️ No active session found, staying on welcome page');
          if (mounted && window.location.pathname !== '/welcome' && window.location.pathname !== '/auth') {
            navigate('/welcome');
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setUserId(null);
          setUserRole(null);
          if (window.location.pathname !== '/welcome' && window.location.pathname !== '/auth') {
            navigate('/welcome');
          }
          toast({
            title: "Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setSessionLoading(false);
        }
      }
    };

    // Set up auth state listener
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
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUserId(null);
          setUserRole(null);
          setSessionLoading(false);
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
  }, [navigate, handleSessionChange, toast, setSessionLoading, setUserId, setUserRole]);

  return (
    <AuthContext.Provider value={{
      userId,
      loading: authLoading,
      logout,
      isAuthenticated: !!userId,
      userRole,
      setLoading: setSessionLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
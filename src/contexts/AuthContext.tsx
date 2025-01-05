import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const checkUser = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && mounted) {
          console.log('✅ Found active session for:', session.user.email);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setUserRole(profile?.roles?.name || null);
            console.log('👤 User role set to:', profile?.roles?.name);
          }
        } else {
          console.log('❌ No active session found');
          if (mounted) {
            setUserId(null);
            setUserEmail(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set a shorter timeout to prevent long loading states
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.log('⚠️ Auth check timed out, resetting state...');
        setLoading(false);
        setInitialized(true);
      }
    }, 3000); // 3 second timeout

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        clearTimeout(timeoutId);
        
        if (session && mounted) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          console.log('✅ User signed in:', session.user.email);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setUserRole(profile?.roles?.name || null);
          }
        } else {
          if (mounted) {
            setUserId(null);
            setUserEmail(null);
            setUserRole(null);
          }
        }
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth context...');
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    setLoading(false);
  };

  if (!initialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider value={{ 
      userId, 
      userEmail,
      loading, 
      logout, 
      isAuthenticated,
      userRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
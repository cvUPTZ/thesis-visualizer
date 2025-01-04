import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    
    const checkUser = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          // Fetch user role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.roles?.name || null);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          console.log('✅ User signed in:', session.user.email);
          
          // Fetch user role when auth state changes
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.roles?.name || null);
        } else {
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth context...');
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
  };

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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from './auth/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    
    const checkUser = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: null // Will be set after profile fetch
          });
          
          // Fetch user role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          const role = profile?.roles?.name || null;
          setUserRole(role);
          setUser(prev => prev ? { ...prev, role } : null);
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
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: null // Will be set after profile fetch
          });
          
          console.log('✅ User signed in:', session.user.email);
          
          // Fetch user role when auth state changes
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          const role = profile?.roles?.name || null;
          setUserRole(role);
          setUser(prev => prev ? { ...prev, role } : null);
        } else {
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
          setUser(null);
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
    console.log('🔄 Starting logout process...');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during logout:', error);
        throw error;
      }
      console.log('✅ Logout successful');
      
      // Clear all auth state
      setUserId(null);
      setUserEmail(null);
      setUserRole(null);
      setUser(null);
      
      // Add a small delay before reload to ensure state is cleared
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('❌ Error during logout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider value={{ 
      userId, 
      userEmail,
      loading,
      isLoading: loading, // alias for backward compatibility
      user,
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User, SignInResponse } from './auth/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    
    const checkUser = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          throw sessionError;
        }
        
        if (session) {
          console.log('✅ Valid session found:', session.user.email);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: null // Will be set after profile fetch
          });
          
          // Fetch user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('❌ Error fetching profile:', profileError);
            throw profileError;
          }

          const role = profile?.roles?.name || null;
          console.log('✅ User role fetched:', role);
          setUserRole(role);
          setUser(prev => prev ? { ...prev, role } : null);
        } else {
          console.log('ℹ️ No active session found');
          // Clear all auth state when no session exists
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    // Initial session check
    checkUser();

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: null
          });
          
          // Fetch user role when auth state changes
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
          
          const role = profile?.roles?.name || null;
          setUserRole(role);
          setUser(prev => prev ? { ...prev, role } : null);
          
          console.log('✅ Auth state updated with role:', role);
        } else {
          // Clear all auth state on signout or session expiration
          setUserId(null);
          setUserEmail(null);
          setUserRole(null);
          setUser(null);
          console.log('ℹ️ Auth state cleared');
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth context...');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('🔄 Starting sign out process...');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during sign out:', error);
        throw error;
      }
      
      console.log('✅ Sign out successful');
      // Clear all auth state
      setUserId(null);
      setUserEmail(null);
      setUserRole(null);
      setUser(null);
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      // Add a small delay before reload to ensure state is cleared
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    } catch (error) {
      console.error('❌ Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: { email: string; password: string }): Promise<SignInResponse> => {
    try {
      setLoading(true);
      console.log('🔄 Attempting sign in for:', credentials.email);
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        throw signInError;
      }
      
      if (!authData.user) {
        console.error('❌ No user data returned');
        throw new Error('No user data returned');
      }

      console.log('✅ Sign in successful');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('roles (name)')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      const userRole = profile?.roles?.name || 'user';
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        role: userRole,
      };

      setUser(user);
      setUserRole(userRole);
      setUserId(authData.user.id);
      setUserEmail(authData.user.email);

      return { user, userRole };
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!userId;

  const contextValue: AuthContextType = {
    userId,
    userEmail,
    loading,
    isLoading: loading,
    user,
    error,
    signIn,
    signOut,
    logout: signOut, // Alias for backward compatibility
    isAuthenticated,
    userRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
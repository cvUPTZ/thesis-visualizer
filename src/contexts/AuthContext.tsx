import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useSession } from './auth/useSession';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userId: string | null;
  userEmail: string | null;
  session: Session | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    userRole,
    setUserRole,
    loading: isLoading,
    setLoading,
    handleSessionChange,
    logout
  } = useSession();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('🔄 AuthProvider - Initializing');
    let isMounted = true;

    // Clear all application cache and data immediately on mount
    const clearAllCache = async () => {
      try {
        console.log('🧹 Clearing all application cache and data');
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear all application caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(name => caches.delete(name))
          );
        }
        
        // Clear IndexedDB databases
        if (window.indexedDB) {
          const dbs = await window.indexedDB.databases();
          await Promise.all(
            dbs.map(db => window.indexedDB.deleteDatabase(db.name!))
          );
        }
        
        console.log('✅ Cache clearing completed');
      } catch (error) {
        console.error('❌ Error clearing cache:', error);
      }
    };

    const initializeAuth = async () => {
      try {
        if (!isMounted) return;
        
        await clearAllCache();
        
        console.log('🔄 Checking initial session...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          return;
        }

        console.log('📡 Initial session:', initialSession?.user?.email);
        
        if (initialSession?.user && isMounted) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select(`
                email,
                roles (
                  name
                )
              `)
              .eq('id', initialSession.user.id)
              .single();

            if (profileError) {
              console.error('❌ Error fetching profile:', profileError);
              throw profileError;
            }

            if (profile && isMounted) {
              await handleSessionChange(initialSession);
              setSession(initialSession);
              console.log('✅ Profile loaded successfully:', profile);
            }
          } catch (error) {
            console.error('❌ Error in profile fetch:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to initialize authentication",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔄 Auth state changed:', event, currentSession?.user?.email);
      if (!isMounted) return;
      
      if (currentSession) {
        await handleSessionChange(currentSession);
        setSession(currentSession);
      } else {
        setSession(null);
        setUserId(null);
        setUserEmail(null);
        setUserRole(null);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscriptions');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [handleSessionChange, setLoading, setUserId, setUserEmail, setUserRole, toast]);

  const value = {
    isAuthenticated: !!session,
    isLoading,
    userRole,
    userId,
    userEmail,
    session,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
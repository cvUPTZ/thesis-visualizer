import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  userRole: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

      if (error) throw error;
      
      const roleName = profile?.roles?.name || null;
      console.log('✅ User role fetched:', roleName);
      return roleName;
    } catch (error) {
      console.error('❌ Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Valid session found, updating user data');
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          const roleName = await fetchUserRole(session.user.id);
          setUserRole(roleName);
        } else {
          console.log('ℹ️ No valid session found');
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    console.log('🔄 Setting up auth state listener...');
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        const roleName = await fetchUserRole(session.user.id);
        setUserRole(roleName);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setIsAuthenticated(false);
        setUserId(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const logout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      setUserRole(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userId,
      userRole,
      loading,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
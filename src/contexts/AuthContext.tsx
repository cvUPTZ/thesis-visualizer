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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
            
          setUserRole(profile?.roles?.name || null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles (name)')
          .eq('id', session.user.id)
          .single();
          
        setUserRole(profile?.roles?.name || null);
      } else if (event === 'SIGNED_OUT') {
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
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error during logout:', error);
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
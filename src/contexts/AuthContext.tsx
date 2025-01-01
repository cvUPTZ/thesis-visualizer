import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { thesisService } from '@/services/thesisService';
import { Profile } from '@/types/profile';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userId: string | null;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  userId: null,
  userRole: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const { toast } = useToast();


    useEffect(() => {
        const checkAuth = async () => {
            try {
                 console.log('Checking authentication status...');
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log('Session data:', session);
                 console.log('Session error:', error);

                if (error) {
                   console.error('Error checking session:', error);
                    toast({
                        title: 'Authentication Error',
                       description: 'There was an error checking your authentication status.',
                        variant: 'destructive',
                    });
                     return;
                }

                if (session) {
                     console.log('Session verified successfully');
                    setIsAuthenticated(true);
                    setUserId(session.user.id);
                   console.log('User ID:', session.user.id);

                    // Fetch user profile and role
                    const profile = await thesisService.getUserProfile(session.user.id);

                     if (profile) {
                         setUserRole(profile.role || null);
                        console.log('User role:', profile?.role || null);
                    }


                } else {
                     setIsAuthenticated(false);
                   setUserId(null);
                     setUserRole(null);
                   console.log('No session found');
               }

           } catch (error) {
                console.error('Error in checkAuth:', error);
           } finally {
              console.log('Setting loading to false')
              setLoading(false);
           }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            if (event === 'SIGNED_IN' && session) {
                setIsAuthenticated(true);
                setUserId(session.user.id);
                 console.log('User ID:', session.user.id);


                // Fetch user profile and role
                const profile = await thesisService.getUserProfile(session.user.id);

                 if (profile) {
                   setUserRole(profile.role || null);
                  console.log('User role:', profile?.role || null);
                 }


            } else if (event === 'SIGNED_OUT') {
              setIsAuthenticated(false);
                setUserId(null);
               setUserRole(null);
              console.log('User signed out');
           }
       });

      return () => {
           subscription.unsubscribe();
        };
   }, [toast]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, userId, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
 isAuthenticated: boolean;
 userId: string | null;
 userEmail: string | null;
 handleLogout: () => Promise<void>;
 loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [userId, setUserId] = useState<string | null>(null);
 const [userEmail, setUserEmail] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
 const { toast } = useToast();

 useEffect(() => {
   const initSession = async () => {
     try {
       const { data: { session }, error: sessionError } = await supabase.auth.getSession();

       if (sessionError) {
         console.error('Error getting session:', sessionError);
         setLoading(false);
         return;
       }

       if (session) {
         setIsAuthenticated(true);
         setUserId(session.user.id);
         setUserEmail(session.user.email);
         navigate('/');
       } else {
         setIsAuthenticated(false);
         setUserId(null);
         setUserEmail(null);
       }
       setLoading(false);
     } catch (error) {
       console.error('Error initializing session:', error);
       setLoading(false);
     }
   };

   initSession();

   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
     console.log('🔄 Auth state changed:', event, session?.user?.email);
     if (event === 'SIGNED_IN' && session) {
       setIsAuthenticated(true);
       setUserId(session.user.id);
       setUserEmail(session.user.email);
       navigate('/');
     } else if (event === 'SIGNED_OUT') {
       setIsAuthenticated(false);
       setUserId(null);
       setUserEmail(null);
       navigate('/');
     }
   });

   return () => subscription.unsubscribe();
 }, [navigate]);

 const handleLogout = async () => {
   console.log('🔄 Starting logout process...');
   
   try {
     // First clear local state
     setIsAuthenticated(false);
     setUserId(null);
     setUserEmail(null);
     
     // Then attempt to sign out from Supabase
     const { error } = await supabase.auth.signOut({
       scope: 'local'  // Changed from 'global' to 'local'
     });
     
     if (error) {
       console.error('❌ Error during signOut:', error);
       // Don't show error toast for session_not_found as it's expected in some cases
       if (!error.message.includes('session_not_found')) {
         toast({
           title: "Notice",
           description: "There was an issue signing out from the server",
           variant: "default",
         });
       }
     } else {
       console.log('✅ Logout successful');
       toast({
         title: "Success",
         description: "You have been signed out successfully",
       });
     }
   } catch (error: any) {
     console.error('❌ Unexpected error during logout:', error);
     toast({
       title: "Notice",
       description: "You have been signed out locally",
       variant: "default",
     });
   } finally {
     // Always navigate to auth page after logout attempt
     setLoading(false);
     navigate('/auth');
   }
 };

 return (
   <AuthContext.Provider value={{ isAuthenticated, userId, userEmail, handleLogout, loading }}>
     {children}
   </AuthContext.Provider>
 );
};
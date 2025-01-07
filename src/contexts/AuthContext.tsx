import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
 const location = useLocation();
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
         // Only navigate to root if we're on the auth page
         if (location.pathname === '/auth') {
           navigate('/');
         }
       } else {
         setIsAuthenticated(false);
         setUserId(null);
         setUserEmail(null);
         // If not authenticated and not on auth page, redirect to auth
         if (location.pathname !== '/auth' && location.pathname !== '/') {
           navigate('/auth');
         }
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
       // Only navigate to root if we're on the auth page
       if (location.pathname === '/auth') {
         navigate('/');
       }
     } else if (event === 'SIGNED_OUT') {
       setIsAuthenticated(false);
       setUserId(null);
       setUserEmail(null);
       navigate('/auth');
     }
   });

   return () => subscription.unsubscribe();
 }, [navigate, location.pathname]);

 const handleLogout = async () => {
   console.log('🔄 Starting logout process...');
   
   try {
     // First clear local state
     setIsAuthenticated(false);
     setUserId(null);
     setUserEmail(null);
     
     // Then attempt to sign out from Supabase
     const { error } = await supabase.auth.signOut({
       scope: 'local'
     });
     
     if (error) {
       console.error('❌ Error during signOut:', error);
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
     setLoading(false);
     navigate('/auth');
   }
 };

 const value = {
   isAuthenticated,
   userId,
   userEmail,
   handleLogout,
   loading
 };

 return (
   <AuthContext.Provider value={value}>
     {children}
   </AuthContext.Provider>
 );
};
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
         navigate('/dashboard');
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
     if (event === 'SIGNED_IN' && session) {
       setIsAuthenticated(true);
       setUserId(session.user.id);
       setUserEmail(session.user.email);
       navigate('/dashboard');
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
   setLoading(true);
   try {
     setIsAuthenticated(false);
     setUserId(null);
     setUserEmail(null);
     
     const { error } = await supabase.auth.signOut({ scope: 'global' });
     
     if (error && !error.message.includes('session_not_found')) {
       toast({
         title: "Notice",
         description: "You have been signed out, but there was an issue with the server",
         variant: "default",
       });
     } else {
       toast({
         title: "Success",
         description: "You have been signed out successfully",
       });
     }
   } catch (error) {
     toast({
       title: "Notice",
       description: "You have been signed out locally",
       variant: "default",
     });
   } finally {
     setLoading(false);
     navigate('/');
   }
 };

 return (
   <AuthContext.Provider value={{ isAuthenticated, userId, userEmail, handleLogout, loading }}>
     {children}
   </AuthContext.Provider>
 );
};
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateThesis from "./pages/CreateThesis";
import { ThesisEditor } from "@/components/ThesisEditor";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mountedRef.current) {
            setIsAuthenticated(false);
            // Don't try to sign out if there's already a session error
            toast({
              title: "Authentication Error",
              description: "Please sign in again.",
              variant: "destructive",
            });
          }
          return;
        }

        if (!session) {
          console.log('No active session found');
          if (mountedRef.current) {
            setIsAuthenticated(false);
          }
          return;
        }

        console.log('Current session:', session);

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User verification failed:', userError);
          if (mountedRef.current) {
            setIsAuthenticated(false);
            // Only attempt to sign out if we had a valid session before
            if (session) {
              try {
                await supabase.auth.signOut();
              } catch (signOutError) {
                console.error('Error during sign out:', signOutError);
              }
            }
            toast({
              title: "Session Expired",
              description: "Please sign in again.",
              variant: "destructive",
            });
          }
          return;
        }

        if (mountedRef.current) {
          setIsAuthenticated(true);
          // Set up a periodic session check
          timeoutId = setTimeout(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
        }
      } catch (error: any) {
        console.error('Error checking auth:', error);
        if (mountedRef.current) {
          setIsAuthenticated(false);
          // Only attempt to sign out if we might have had a valid session
          try {
            await supabase.auth.signOut();
          } catch (signOutError) {
            console.error('Error during sign out:', signOutError);
          }
          toast({
            title: "Authentication Error",
            description: error.message || "Please sign in again.",
            variant: "destructive",
          });
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (!mountedRef.current) return;

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        toast({
          title: "Signed Out",
          description: "You have been signed out.",
        });
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        toast({
          title: "Signed In",
          description: "Welcome back!",
        });
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [toast]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thesis/:thesisId"
            element={
              <ProtectedRoute>
                <ThesisEditor />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/create-thesis"
            element={
              <ProtectedRoute>
                <CreateThesis />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
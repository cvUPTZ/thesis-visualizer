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
import LandingPage from "./pages/LandingPage";

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
            localStorage.clear();
          }
          return;
        }

        if (!session) {
          console.log('No active session found');
          if (mountedRef.current) {
            setIsAuthenticated(false);
            localStorage.clear();
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User verification failed:', userError);
          if (mountedRef.current) {
            setIsAuthenticated(false);
            localStorage.clear();
            try {
              await supabase.auth.signOut();
            } catch (signOutError) {
              console.error('Error during sign out:', signOutError);
            }
            toast({
              title: "Session Expired",
              description: "Please sign in again.",
              variant: "destructive",
            });
          }
          return;
        }

        console.log('Session verified successfully');
        if (mountedRef.current) {
          setIsAuthenticated(true);
          timeoutId = setTimeout(checkAuth, 5 * 60 * 1000);
        }
      } catch (error: any) {
        console.error('Error checking auth:', error);
        if (mountedRef.current) {
          setIsAuthenticated(false);
          localStorage.clear();
          toast({
            title: "Authentication Error",
            description: error.message || "Please sign in again.",
            variant: "destructive",
          });
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (!mountedRef.current) return;

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.clear();
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
      if (subscription) subscription.unsubscribe();
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
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes */}
          <Route path="/welcome" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/thesis/:thesisId" element={
            <ProtectedRoute>
              <ThesisEditor />
            </ProtectedRoute>
          } />
          <Route path="/create-thesis" element={
            <ProtectedRoute>
              <CreateThesis />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
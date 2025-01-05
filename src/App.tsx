import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Route, Routes } from 'react-router-dom';
import { ThesisEditor } from './components/ThesisEditor';
import { ThesisList } from './components/thesis/ThesisList';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import Index from './pages/Index';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSkeleton } from './components/loading/LoadingSkeleton';
import LandingPage from './pages/LandingPage';

const App = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Initializing app...');
    const timeout = setTimeout(() => {
      setIsLoading(false);
      console.log('⌛ Loading timeout reached, showing content');
    }, 4000); // 4 second maximum loading time

    const handleAuthStateChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [toast]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Routes>
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
      <Route path="/thesis/:thesisId" element={
        <ProtectedRoute>
          <ThesisEditor />
        </ProtectedRoute>
      } />
      <Route path="/thesis" element={
        <ProtectedRoute>
          <ThesisList />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
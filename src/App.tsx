import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Route, Routes } from 'react-router-dom';
import { ThesisEditor } from './components/ThesisEditor';
import { ThesisList } from './components/thesis/ThesisList';
import { Auth } from './pages/Auth';
import { AdminPanel } from './pages/AdminPanel';
import { Index } from './pages/Index';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
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
    };
  }, [toast]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
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
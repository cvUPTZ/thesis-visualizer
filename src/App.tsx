import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThesisEditor } from './components/ThesisEditor';
import { ThesisList } from './components/thesis/ThesisList';

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
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
    <Router>
      <Routes>
        <Route path="/" element={<ThesisList />} />
        <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
      </Routes>
    </Router>
  );
};

export default App;

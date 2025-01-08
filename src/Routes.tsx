import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreateThesis from '@/pages/CreateThesis';
import AdminPanel from '@/pages/AdminPanel';
import LandingPage from '@/pages/LandingPage';
import { useAuth } from '@/contexts/AuthContext';
import { ThesisEditor } from '@/components/ThesisEditor';

export const Routes = () => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🔐 Auth state:', { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <RouterRoutes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/create-thesis" element={<CreateThesis />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
          <Route path="*" element={<Index />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<LandingPage />} />
        </>
      )}
    </RouterRoutes>
  );
};

export default Routes;
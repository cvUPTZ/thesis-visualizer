import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreateThesis from '@/pages/CreateThesis';
import AdminPanel from '@/pages/AdminPanel';
import LandingPage from '@/pages/LandingPage';
import { useAuth } from '@/contexts/AuthContext';

const Routes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <RouterRoutes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/create-thesis" element={<CreateThesis />} />
          <Route path="/admin" element={<AdminPanel />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
        </>
      )}
    </RouterRoutes>
  );
};

export default Routes;
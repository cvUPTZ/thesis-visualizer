import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';

const Routes = () => {
  const { isAuthenticated } = useAuth();
  console.log('🔐 Auth state:', isAuthenticated);

  return (
    <RouterRoutes>
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Auth />
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <Index /> : <Navigate to="/auth" replace />
        }
      />
    </RouterRoutes>
  );
};

export default Routes;
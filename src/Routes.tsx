import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import { ThesisEditor } from './components/ThesisEditor';
import CreateThesis from './pages/CreateThesis';

export default function Routes() {
  const { isAuthenticated, userId } = useAuth();
  console.log('🚀 Routes rendering with auth state:', { isAuthenticated, userId });

  if (!isAuthenticated) {
    return (
      <RouterRoutes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    );
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<CreateThesis />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}
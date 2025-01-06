import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import { ThesisEditor } from './components/ThesisEditor';
import CreateThesis from './pages/CreateThesis';
import Index from './pages/Index';
import { useUserProfile } from './hooks/useUserProfile';

export default function Routes() {
  const { isAuthenticated, userId } = useAuth();
  const { data: profile, isLoading } = useUserProfile(userId);
  
  console.log('🚀 Routes rendering with auth state:', { isAuthenticated, userId });
  console.log('👤 User profile:', profile);

  if (!isAuthenticated) {
    return (
      <RouterRoutes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </RouterRoutes>
    );
  }

  // Show loading state while fetching user profile
  if (isLoading) {
    return null; // Or a loading spinner
  }

  const isAdmin = profile?.roles?.name === 'admin';
  console.log('🔑 User admin status:', isAdmin);

  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/create-thesis" element={<CreateThesis />} />
      {isAdmin ? (
        <Route path="/admin" element={<AdminPanel />} />
      ) : (
        <Route path="/admin" element={<Navigate to="/" replace />} />
      )}
      <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}
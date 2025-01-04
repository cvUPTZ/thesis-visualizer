import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ThesisEditor } from '@/components/ThesisEditor';

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <main>
          <Toaster />
          <Routes>
            {/* Public routes - No loading state */}
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - Loading state except for root and thesis routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route
              path="/thesis/:thesisId"
              element={
                <ProtectedRoute>
                  <ThesisEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-thesis"
              element={
                <ProtectedRoute>
                  <CreateThesis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const currentPath = window.location.pathname;
  console.log('🔒 Protected Route Check:', { isAuthenticated, loading, userRole });

  // Skip loading state for root route and thesis routes
  if (loading && currentPath !== '/' && !currentPath.startsWith('/thesis/')) {
    console.log('⌛ Loading protected route...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  console.log('👑 Admin Route Check:', { isAuthenticated, loading, userRole });

  if (loading) {
    console.log('⌛ Loading admin route...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" />;
  }

  if (userRole !== 'admin') {
    console.log('🚫 User not authorized, redirecting to /');
    return <Navigate to="/" />;
  }

  console.log('✅ Access granted to admin route');
  return <>{children}</>;
};

export default App;
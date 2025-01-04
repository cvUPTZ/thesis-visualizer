import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ThesisEditor } from '@/components/ThesisEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthLoader } from '@/components/auth/AuthLoader';

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🎯 App Render State:', { isAuthenticated, loading });

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <main>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route 
              path="/welcome" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <LandingPage />
              } 
            />
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Auth />
              } 
            />
            
            {/* Protected routes */}
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

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Suspense>
    </div>
  );
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  console.log('🔒 Protected Route Check:', { isAuthenticated, userRole, loading });

  if (loading) {
    console.log("🔒 Auth loading...");
    return <AuthLoader />;
  }
  
  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /welcome');
    return <Navigate to="/welcome" />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  console.log('👑 Admin Route Check:', { isAuthenticated, userRole, loading });

  if (loading) {
    console.log('👑 Admin Auth loading...');
    return <AuthLoader />;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /welcome');
    return <Navigate to="/welcome" />;
  }

  if (userRole !== 'admin') {
    console.log('🚫 User not authorized, redirecting to /');
    return <Navigate to="/" />;
  }

  console.log('✅ Access granted to admin route');
  return <>{children}</>;
};

export default App;
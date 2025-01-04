import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ThesisEditor } from '@/components/ThesisEditor';
import { Skeleton } from '@/components/ui/skeleton';
import withAuthorization from '@/components/ProtectedRoute';

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const App = () => {
    const { loading } = useAuth();
    if (loading) {
        return <LoadingFallback />
    }

    const ProtectedRoute = withAuthorization(({ children }: ProtectedRouteProps) => <>{children}</>);
    const AdminRoute = withAuthorization(({ children }: ProtectedRouteProps) => <>{children}</>);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <main>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
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
                <AdminRoute requiredRole="admin">
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </Suspense>
    </div>
  );
};

export default App;
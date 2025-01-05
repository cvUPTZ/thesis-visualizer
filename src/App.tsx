import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { ThesisEditor } from '@/components/ThesisEditor';

// Public route wrapper component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  
  console.log('🔍 PublicRoute - Auth state:', { isAuthenticated, isLoading, userRole });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isAuthenticated) {
    console.log('✅ User is authenticated, redirecting based on role:', userRole);
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  console.log('🔄 App component rendering...');
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={<LandingPage />}
            />
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } 
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
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
              path="/thesis/:thesisId"
              element={
                <ProtectedRoute>
                  <ThesisEditor />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { ThesisEditor } from '@/components/ThesisEditor';

function App() {
  console.log('🔄 App component rendering...');
  
  return (
    <ErrorBoundary>
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
            <AuthGuard>
              <Index />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole="admin">
              <AdminPanel />
            </AuthGuard>
          }
        />
        <Route
          path="/create-thesis"
          element={
            <AuthGuard>
              <CreateThesis />
            </AuthGuard>
          }
        />
        <Route
          path="/thesis/:thesisId"
          element={
            <AuthGuard>
              <ThesisEditor />
            </AuthGuard>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
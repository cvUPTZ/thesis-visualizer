import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import AuthAlternate from '@/pages/AuthAlternate';
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
      {/* Route Configuration */}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <>
              {console.log('📍 Rendering landing page route')}
              <LandingPage />
            </>
          }
        />
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              {console.log('🔑 Rendering auth page route')}
              <Auth />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth-alternate" 
          element={
            <PublicRoute>
              {console.log('🔑 Rendering alternate auth page route')}
              <AuthAlternate />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              {console.log('📊 Rendering dashboard route')}
              <Index />
            </AuthGuard>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole="admin">
              {console.log('👑 Rendering admin panel route')}
              <AdminPanel />
            </AuthGuard>
          }
        />
        <Route
          path="/create-thesis"
          element={
            <AuthGuard>
              {console.log('📝 Rendering create thesis route')}
              <CreateThesis />
            </AuthGuard>
          }
        />
        <Route
          path="/thesis/:thesisId"
          element={
            <AuthGuard>
              {console.log('📖 Rendering thesis editor route')}
              <ThesisEditor />
            </AuthGuard>
          }
        />

        {/* Catch-all Route */}
        <Route 
          path="*" 
          element={
            <>
              {console.log('🚫 No matching route found, redirecting to home')}
              <Navigate to="/" replace />
            </>
          } 
        />
      </Routes>

      {/* Global Components */}
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
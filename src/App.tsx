import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PublicRoute } from '@/components/auth/PublicRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ThesisEditor } from '@/components/ThesisEditor';

function App() {
  console.log('🔄 App component rendering...');
 
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute><Outlet /></PublicRoute>}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AuthGuard><Outlet /></AuthGuard>}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/create-thesis" element={<CreateThesis />} />
              <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AuthGuard requiredRole="admin"><Outlet /></AuthGuard>}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
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

const App = () => {
  console.log('🔄 App component rendering...');

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/dashboard" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard requiredRole="admin"><AdminPanel /></AuthGuard>} />
            <Route path="/create-thesis" element={<AuthGuard><CreateThesis /></AuthGuard>} />
            <Route path="/thesis/:thesisId" element={<AuthGuard><ThesisEditor /></AuthGuard>} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
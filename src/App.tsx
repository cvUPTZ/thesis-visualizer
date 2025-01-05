import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
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
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/dashboard" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard><AdminPanel /></AuthGuard>} />
          <Route path="/create-thesis" element={<AuthGuard><CreateThesis /></AuthGuard>} />
          <Route path="/thesis/:thesisId" element={<AuthGuard><ThesisEditor /></AuthGuard>} />
        </Routes>
      </Router>
      <Toaster />
    </ErrorBoundary>
  );
};

export default App;
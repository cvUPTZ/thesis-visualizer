import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/create-thesis" element={<CreateThesis />} />
        <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
};

export default App;
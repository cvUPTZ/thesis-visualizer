import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { ThesisEditor } from '@/components/ThesisEditor';
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import CreateThesis from '@/pages/CreateThesis';
import AdminPanel from '@/pages/AdminPanel';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/create" element={<CreateThesis />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
    </RouterRoutes>
  );
};

export default Routes;
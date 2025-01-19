import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import CreateThesis from './pages/CreateThesis';
import ChaptersPage from './pages/ChaptersPage';
import ChapterEditor from './pages/ChapterEditor';
import FiguresPage from './pages/FiguresPage';
import TablesPage from './pages/TablesPage';
import BibliographyPage from './pages/BibliographyPage';
import { ThesisSidebar } from './components/ThesisSidebar';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/thesis" element={<ThesisSidebar />}>
        <Route path="create" element={<CreateThesis />} />
        <Route path="chapters" element={<ChaptersPage />} />
        <Route path="chapters/:chapterId" element={<ChapterEditor />} />
        <Route path="figures" element={<FiguresPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="bibliography" element={<BibliographyPage />} />
      </Route>

      {/* Redirect unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes;
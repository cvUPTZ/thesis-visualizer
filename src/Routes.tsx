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
import { Section } from './types/thesis';

const Routes = () => {
  const [sections, setSections] = React.useState<Section[]>([]);
  const [activeSection, setActiveSection] = React.useState('');

  const handleSectionSelect = (id: string) => {
    setActiveSection(id);
    console.log('Section selected:', id);
  };

  return (
    <RouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route path="/thesis" element={
        <ThesisSidebar 
          sections={sections}
          activeSection={activeSection}
          onSectionSelect={handleSectionSelect}
        />
      }>
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
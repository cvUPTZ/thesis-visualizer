import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreateThesis from '@/pages/CreateThesis';
import AdminPanel from '@/pages/AdminPanel';
import LandingPage from '@/pages/LandingPage';
import { useAuth } from '@/contexts/AuthContext';
import { ThesisEditor } from '@/components/ThesisEditor';
import StudentInfo from '@/pages/StudentInfo';
import SupervisorInfo from '@/pages/SupervisorInfo';
import ThesisInfo from '@/pages/ThesisInfo';
import AbstractPage from '@/pages/AbstractPage';
import StatementPage from '@/pages/StatementPage';
import PrefacePage from '@/pages/PrefacePage';
import AcknowledgmentsPage from '@/pages/AcknowledgmentsPage';
import ChaptersPage from '@/pages/ChaptersPage';
import FiguresPage from '@/pages/FiguresPage';
import TablesPage from '@/pages/TablesPage';
import BibliographyPage from '@/pages/BibliographyPage';
import { ThesisSidebar } from '@/components/thesis/ThesisSidebar';

const Routes = () => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('🔐 Auth state:', { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen bg-background">
      <ThesisSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );

  return (
    <RouterRoutes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<AuthenticatedLayout><Index /></AuthenticatedLayout>} />
          <Route path="/create-thesis" element={<AuthenticatedLayout><CreateThesis /></AuthenticatedLayout>} />
          <Route path="/admin" element={<AuthenticatedLayout><AdminPanel /></AuthenticatedLayout>} />
          <Route path="/thesis/:thesisId" element={<AuthenticatedLayout><ThesisEditor /></AuthenticatedLayout>} />
          <Route path="/student-info" element={<AuthenticatedLayout><StudentInfo /></AuthenticatedLayout>} />
          <Route path="/supervisor-info" element={<AuthenticatedLayout><SupervisorInfo /></AuthenticatedLayout>} />
          <Route path="/thesis-info" element={<AuthenticatedLayout><ThesisInfo /></AuthenticatedLayout>} />
          <Route path="/abstract" element={<AuthenticatedLayout><AbstractPage /></AuthenticatedLayout>} />
          <Route path="/statement" element={<AuthenticatedLayout><StatementPage /></AuthenticatedLayout>} />
          <Route path="/preface" element={<AuthenticatedLayout><PrefacePage /></AuthenticatedLayout>} />
          <Route path="/acknowledgments" element={<AuthenticatedLayout><AcknowledgmentsPage /></AuthenticatedLayout>} />
          <Route path="/chapters" element={<AuthenticatedLayout><ChaptersPage /></AuthenticatedLayout>} />
          <Route path="/figures" element={<AuthenticatedLayout><FiguresPage /></AuthenticatedLayout>} />
          <Route path="/tables" element={<AuthenticatedLayout><TablesPage /></AuthenticatedLayout>} />
          <Route path="/bibliography" element={<AuthenticatedLayout><BibliographyPage /></AuthenticatedLayout>} />
          <Route path="*" element={<AuthenticatedLayout><Index /></AuthenticatedLayout>} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<LandingPage />} />
        </>
      )}
    </RouterRoutes>
  );
};

export default Routes;
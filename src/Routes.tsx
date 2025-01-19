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

  return (
    <RouterRoutes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/create-thesis" element={<CreateThesis />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/thesis/:thesisId" element={<ThesisEditor />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/supervisor-info" element={<SupervisorInfo />} />
          <Route path="/thesis-info" element={<ThesisInfo />} />
          <Route path="/abstract" element={<AbstractPage />} />
          <Route path="/statement" element={<StatementPage />} />
          <Route path="/preface" element={<PrefacePage />} />
          <Route path="/acknowledgments" element={<AcknowledgmentsPage />} />
          <Route path="*" element={<Index />} />
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
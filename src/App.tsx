import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';
import { Button } from './components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

function AppContent() {
  console.log('🚀 App content rendering');
  const navigate = useNavigate();
  const location = useLocation();
  
  const shouldShowBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';
  
  return (
    <>
      {shouldShowBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      )}
      <Routes />
      <Toaster />
    </>
  );
}

function App() {
  console.log('🚀 App wrapper rendering');
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
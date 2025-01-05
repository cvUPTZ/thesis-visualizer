import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ErrorBoundary>
            <Routes />
            <Toaster />
          </ErrorBoundary>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
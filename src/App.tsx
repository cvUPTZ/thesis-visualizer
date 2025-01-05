import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App rendering');
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ErrorBoundary>
            <Routes />
            <Toaster />
          </ErrorBoundary>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
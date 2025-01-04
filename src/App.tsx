import { FC } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

const App: FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminPanel />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
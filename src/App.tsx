import ErrorBoundary from './components/ErrorBoundary';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminPanel />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
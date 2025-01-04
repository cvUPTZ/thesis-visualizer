import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AdminPanel />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

import { ThemeProvider } from './components/ThemeProvider';
import Routes from './Routes';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <Routes />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
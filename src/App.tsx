import React from 'react';
import { Routes } from './Routes';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { PlatformPresentation } from './components/onboarding/PlatformPresentation';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Routes />
        <PlatformPresentation />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
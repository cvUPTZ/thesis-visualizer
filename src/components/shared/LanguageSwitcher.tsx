import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="text-white hover:text-[#D6BCFA] transition-colors"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe className="h-5 w-5" />
      <span className="ml-2 text-sm">{language === 'en' ? 'عربي' : 'EN'}</span>
    </Button>
  );
};
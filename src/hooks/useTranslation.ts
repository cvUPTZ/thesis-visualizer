import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/utils/translations";

export function useTranslation() {
  const { language } = useLanguage();
  
  function t(key: string) {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  }

  return { t };
}
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={language === 'fr' ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage('fr')}
      >
        FR
      </Button>
      <Button
        variant={language === 'ar' ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage('ar')}
      >
        عربي
      </Button>
    </div>
  );
}
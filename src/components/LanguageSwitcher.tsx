import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-2"
      >
        <Button
          variant={language === 'en' ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage('en')}
          className="min-w-[40px]"
        >
          EN
        </Button>
        <Button
          variant={language === 'fr' ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage('fr')}
          className="min-w-[40px]"
        >
          FR
        </Button>
        <Button
          variant={language === 'ar' ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage('ar')}
          className="min-w-[40px] font-arabic"
        >
          ع
        </Button>
      </motion.div>
    </div>
  );
}
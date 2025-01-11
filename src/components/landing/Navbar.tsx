import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed w-full bg-[#1A1F2C] text-white z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#9b87f5]">
            Otro7a Manager
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {t('common.features')}
            </Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {t('common.about')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link to="/auth">
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]"
              >
                {t('common.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
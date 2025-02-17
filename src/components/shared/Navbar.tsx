import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#1A1F2C] text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#9b87f5] hover:text-[#D6BCFA] transition-colors">
            Thesis Visualizer
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-[#2A2F3C] hover:text-[#D6BCFA]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {t('common.features')}
            </Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {t('common.about')}
            </Link>
            <LanguageSwitcher />
            <Link to="/">
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-all duration-200"
              >
                {t('common.home')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2A2F3C]">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                to="/"
                className="hover:text-[#D6BCFA] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.features')}
              </Link>
              <Link
                to="/"
                className="hover:text-[#D6BCFA] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.about')}
              </Link>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-white border-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-all duration-200"
                >
                  {t('common.home')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
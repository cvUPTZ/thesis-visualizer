import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();

  const navItems = {
    en: {
      features: 'Features',
      about: 'About',
      home: 'Home'
    },
    ar: {
      features: 'المميزات',
      about: 'عن التطبيق',
      home: 'الرئيسية'
    }
  };

  const texts = navItems[language as keyof typeof navItems];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A1F2C] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Thesis<span className="text-[#D6BCFA]">Visualizer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-white">
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {texts.features}
            </Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              {texts.about}
            </Link>
            <Link to="/">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]">
                {texts.home}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1A1F2C] border-t border-gray-700">
            <div className="flex flex-col space-y-4 p-4">
              <Link
                to="/"
                className="text-white hover:text-[#D6BCFA] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {texts.features}
              </Link>
              <Link
                to="/"
                className="text-white hover:text-[#D6BCFA] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {texts.about}
              </Link>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]"
                >
                  {texts.home}
                </Button>
              </Link>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
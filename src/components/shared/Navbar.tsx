import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-[#1A1F2C] text-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#9b87f5]">
            Thesis Visualizer
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              Features
            </Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">
              About
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="hover:text-[#D6BCFA] transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/"
                className="hover:text-[#D6BCFA] transition-colors px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
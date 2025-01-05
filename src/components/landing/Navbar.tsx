import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed w-full bg-[#1A1F2C] text-white z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#9b87f5]">Thesis Visualizer</Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">Features</Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">Pricing</Link>
            <Link to="/" className="hover:text-[#D6BCFA] transition-colors">About</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1F2C]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
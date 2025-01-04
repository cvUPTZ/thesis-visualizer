import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => (
  <nav className="fixed w-full bg-[#1A1F2C] text-white z-50 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/welcome" className="text-2xl font-bold text-[#9b87f5]">Thesis Visualizer</Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/features" className="hover:text-[#D6BCFA] transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-[#D6BCFA] transition-colors">Pricing</Link>
          <Link to="/about" className="hover:text-[#D6BCFA] transition-colors">About</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth">
            <Button className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);
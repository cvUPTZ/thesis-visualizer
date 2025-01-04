import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-[#1A1F2C] text-white py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-[#9b87f5] mb-4">Thesis Visualizer</h3>
          <p className="text-gray-400">Making thesis writing easier</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-400 hover:text-[#D6BCFA] transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Thesis Visualizer. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
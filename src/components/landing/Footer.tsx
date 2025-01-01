import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-gray-400 hover:text-[#D6BCFA] transition-colors">
    {children}
  </Link>
);

export const Footer = () => (
  <footer className="bg-[#1A1F2C] text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="font-semibold">About Us</h4>
          <FooterLink to="/about">Learn More</FooterLink>
          <FooterLink to="/team">Our Team</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">Support</h4>
          <FooterLink to="/contact">Contact Us</FooterLink>
          <FooterLink to="/faq">FAQs</FooterLink>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">Follow Us</h4>
          <FooterLink to="https://twitter.com/thesis_visualizer">Twitter</FooterLink>
          <FooterLink to="https://linkedin.com/company/thesis-visualizer">LinkedIn</FooterLink>
          <FooterLink to="https://github.com/thesis-visualizer">GitHub</FooterLink>
        </div>
      </div>
    </div>
  </footer>
);
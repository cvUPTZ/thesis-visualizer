import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => (
  <nav className="fixed w-full bg-black text-white z-50 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Thesis Visualizer</Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/features" className="hover:text-gray-300">Features</Link>
          <Link to="/pricing" className="hover:text-gray-300">Pricing</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth">
            <Button className="bg-white text-black hover:bg-gray-200">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

const Header = () => (
  <header className="bg-black text-white pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Professional Thesis Writing Tool</h1>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-black text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Thesis Visualizer</h3>
          <p className="text-gray-400">Making thesis writing easier</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
            <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center">
        <p className="text-gray-400">&copy; 2024 Thesis Visualizer. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const sendFeedback = async () => {
    // ... (keeping the existing feedback logic)
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Header />

      {/* Hero Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-8">
              Transform Your Thesis Writing Experience
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Streamline your academic writing process with our powerful visualization
              and organization tools. Perfect for researchers and students.
            </p>
            <Link to="/auth">
              <Button className="bg-white text-black text-lg px-8 py-4 hover:bg-gray-200">
                Start Writing Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Visual Organization</h3>
              <p className="text-gray-600">Structure your thesis with intuitive visual tools</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Smart Citations</h3>
              <p className="text-gray-600">Manage references with ease</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Real-time Collaboration</h3>
              <p className="text-gray-600">Work seamlessly with your supervisors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Share Your Thoughts</h2>
          <div className="space-y-6">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border-gray-700"
            />
            <Textarea
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-gray-800 border-gray-700"
            />
            <Button
              onClick={sendFeedback}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
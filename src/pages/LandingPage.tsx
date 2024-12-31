import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => (
  <nav className="fixed w-full bg-[#1A1F2C] text-white z-50 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#9b87f5]">Thesis Visualizer</Link>
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

const FeatureCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#9b87f5]" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage = () => {
  const { toast } = useToast();

  const handleFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const feedback = formData.get('feedback') as string;

    if (!email || !feedback) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            email,
            role: 'feedback',
            id: crypto.randomUUID(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been received.",
      });
      
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transform Your <span className="text-[#9b87f5]">Thesis Writing</span> Experience
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your academic writing process with our powerful visualization
            and organization tools. Perfect for researchers and students.
          </p>
          <Link to="/auth">
            <Button className="bg-[#9b87f5] text-white text-lg px-8 py-6 rounded-lg hover:bg-[#7E69AB] transition-colors">
              Start Writing Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1A1F2C]">
            Powerful Features for Academic Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Visual Organization"
              description="Structure your thesis with intuitive visual tools and real-time collaboration features."
              icon={() => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            />
            <FeatureCard
              title="Smart Citations"
              description="Manage references effortlessly with our intelligent citation system."
              icon={() => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <FeatureCard
              title="Real-time Collaboration"
              description="Work seamlessly with supervisors and team members in real-time."
              icon={() => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#F1F0FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1A1F2C]">
            Trusted by Academics Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The visual organization tools have completely transformed how I structure my research.",
                author: "Dr. Sarah Chen",
                role: "Research Professor"
              },
              {
                quote: "Citation management has never been easier. This tool is a game-changer.",
                author: "Michael Roberts",
                role: "PhD Candidate"
              },
              {
                quote: "Real-time collaboration with my supervisor has significantly improved my writing process.",
                author: "Emma Thompson",
                role: "Graduate Student"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-[#1A1F2C]">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1A1F2C] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of researchers who have already transformed their thesis writing experience.
          </p>
          <Link to="/auth">
            <Button className="bg-[#9b87f5] text-white text-lg px-8 py-6 rounded-lg hover:bg-[#7E69AB] transition-colors">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default LandingPage;
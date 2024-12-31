import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Navbar component
const Navbar = () => (
  <nav className="fixed w-full bg-[#1A1F2C] text-white z-50 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#9b87f5]">Thesis Visualizer</Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/features" className="hover:text-[#D6BCFA] transition-colors" aria-label="View Features">Features</Link>
          <Link to="/pricing" className="hover:text-[#D6BCFA] transition-colors" aria-label="View Pricing">Pricing</Link>
          <Link to="/about" className="hover:text-[#D6BCFA] transition-colors" aria-label="Learn About Us">About</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/auth">
            <Button className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors" aria-label="Get Started">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

// FeatureCard component
const FeatureCard = memo(({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#9b87f5]" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
));

// TestimonialCard component
const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <p className="text-gray-600 mb-4">{quote}</p>
    <div>
      <p className="font-semibold text-[#1A1F2C]">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

// FooterLink component
const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-gray-400 hover:text-[#D6BCFA] transition-colors" aria-label={children as string}>
    {children}
  </Link>
);

const LandingPage = () => {
  const { toast } = useToast();

  // Feedback form handler
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
        .insert([{
          email,
          role: 'feedback',
          id: crypto.randomUUID(),
        }]);

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
            <TestimonialCard
              quote="This tool helped me visualize my thesis like never before!"
              author="Sarah B."
              role="PhD Student"
            />
            <TestimonialCard
              quote="Fantastic platform for researchers. Highly recommend!"
              author="John D."
              role="Researcher"
            />
            <TestimonialCard
              quote="I saved so much time using this! 5 stars."
              author="Emily T."
              role="Graduate Student"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default LandingPage;

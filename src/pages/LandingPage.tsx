import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { TestimonialCard } from "@/components/landing/TestimonialCard";
import { Footer } from "@/components/landing/Footer";
import { FeedbackForm } from "@/components/landing/FeedbackForm";

const LandingPage = () => {
  const features = [
    {
      title: "Visual Organization",
      description: "Structure your thesis with intuitive visual tools and real-time collaboration features.",
      icon: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      title: "Smart Citations",
      description: "Manage references effortlessly with our intelligent citation system.",
      icon: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Real-time Collaboration",
      description: "Work seamlessly with supervisors and team members in real-time.",
      icon: () => (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const testimonials = [
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
  ];

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
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
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
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
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

      <Footer />
    </div>
  );
};

export default LandingPage;
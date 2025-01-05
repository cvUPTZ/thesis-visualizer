import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, PenTool } from "lucide-react";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { FeaturesComparison } from "@/components/landing/FeaturesComparison";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { FeedbackForm } from "@/components/landing/FeedbackForm";
import ThesisVisualization from "@/components/landing/visualization/ThesisVisualization";
import { useToast } from "@/hooks/use-toast";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Landing page mounting...');
    const timeout = setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Landing page loaded');
      toast({
        title: "Welcome to Thesis Visualizer",
        description: "Explore our features and start writing your thesis with confidence.",
      });
    }, 2000);

    return () => {
      console.log('🧹 Cleaning up landing page timeouts');
      clearTimeout(timeout);
    };
  }, [toast]);

  const handleGetStarted = async () => {
    try {
      console.log('👆 Get Started clicked, preparing navigation...');
      
      toast({
        title: "Let's Get Started!",
        description: "You're being redirected to create your account.",
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔄 Navigating to /auth route...');
      navigate('/auth');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "There was a problem redirecting you. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    console.log('⌛ Showing loading skeleton...');
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 space-y-24">
        {/* Hero Section with Visualization */}
        <section className="pt-32 pb-16 relative">
          <div className="text-center space-y-8 mb-16">
            <GraduationCap className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
              Write Your Thesis with Confidence
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A powerful platform designed to help you structure, write, and
              visualize your academic thesis with ease.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-primary-light hover:opacity-90"
                onClick={handleGetStarted}
              >
                <PenTool className="w-4 h-4" />
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => {
                  console.log('👀 Demo clicked');
                  const demoSection = document.getElementById('demo');
                  demoSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <BookOpen className="w-4 h-4" />
                View Demo
              </Button>
            </div>
          </div>
          
          {/* Thesis Visualization */}
          <ThesisVisualization />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
          <FeaturesComparison />
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20">
          <DemoPreview />
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <TestimonialCarousel />
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <PricingSection />
        </section>

        {/* Feedback Form */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Share Your Feedback</h2>
            <FeedbackForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
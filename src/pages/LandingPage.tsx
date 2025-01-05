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
import ThesisVisualization from "@/components/landing/ThesisVisualization";
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
      <main className="container mx-auto px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <GraduationCap className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold font-serif">
            Write Your Thesis with Confidence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful platform designed to help you structure, write, and
            visualize your academic thesis with ease.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="gap-2"
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
        </section>

        {/* Features Section */}
        <section id="features">
          <FeaturesComparison />
        </section>

        {/* Demo Section */}
        <section id="demo">
          <DemoPreview />
        </section>

        {/* Thesis Visualization */}
        <section>
          <ThesisVisualization />
        </section>

        {/* Testimonials */}
        <section>
          <TestimonialCarousel />
        </section>

        {/* Pricing */}
        <section id="pricing">
          <PricingSection />
        </section>

        {/* Feedback Form */}
        <section>
          <FeedbackForm />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
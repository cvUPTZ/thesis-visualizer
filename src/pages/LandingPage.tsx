import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Brain, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { FeedbackForm } from "@/components/landing/FeedbackForm";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { FeaturesComparison } from "@/components/landing/FeaturesComparison";
import { PricingSection } from "@/components/landing/PricingSection";
import { ThesisVisualization } from "@/components/landing/ThesisVisualization";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-[#1A1F2C] mb-6"
          >
            Write Your Thesis with Confidence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            A powerful platform designed to help you organize, write, and collaborate on your thesis with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg"
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-8 py-6 text-lg rounded-lg"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Thesis Visualization Section */}
      <ThesisVisualization />

      <DemoPreview />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Thesis Visualizer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Smart Organization"
              description="Organize your thesis chapters, citations, and research materials in one place."
              icon={BookOpen}
            />
            <FeatureCard
              title="AI-Powered Assistance"
              description="Get intelligent suggestions and writing assistance powered by advanced AI."
              icon={Brain}
            />
            <FeatureCard
              title="Real-time Collaboration"
              description="Work seamlessly with advisors and collaborators in real-time."
              icon={Share2}
            />
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <FeaturesComparison />

      {/* Testimonials Carousel Section */}
      <TestimonialCarousel />

      {/* Pricing Section */}
      <PricingSection />

      {/* Feedback Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Share Your Feedback</h2>
          <p className="text-gray-600 text-center mb-8">
            We're constantly improving. Let us know how we can make Thesis Visualizer better for you.
          </p>
          <FeedbackForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

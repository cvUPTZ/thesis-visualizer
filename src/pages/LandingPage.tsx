// LandingPage.tsx
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer"; 
import EnhancedThesisViz from "@/components/landing/visualization/EnhancedThesisViz";
import { Navbar } from "@/components/shared/Navbar";
import { FeaturesComparison } from "@/components/landing/FeaturesComparison";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { FeedbackForm } from "@/components/landing/FeedbackForm";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-16">
        <HeroSection />
        <div className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white opacity-50" />
          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Visualize Your Progress
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Track your thesis development with our interactive visualization tool.
                Monitor progress, collaborate with team members, and stay on top of deadlines.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <EnhancedThesisViz />
            </div>
          </div>
        </div>
        <FeaturesSection />
        <DemoPreview />
        <FeaturesComparison />
        <PricingSection />
        <TestimonialCarousel />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-8">Share Your Feedback</h2>
          <FeedbackForm />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
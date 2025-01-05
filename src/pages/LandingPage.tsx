import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import ThesisVisualization from "@/components/landing/ThesisVisualization";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
          <div className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-lg backdrop-filter">
            <ThesisVisualization />
          </div>
        </div>
      </div>
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { ThesisVisualization } from "@/components/landing/ThesisVisualization";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <HeroSection />
      <ThesisVisualization className="border-t border-gray-800" />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
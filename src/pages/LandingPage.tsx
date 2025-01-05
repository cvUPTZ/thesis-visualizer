import React from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { ThesisVisualizationDemo } from "@/components/landing/visualization/ThesisVisualizationDemo";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <HeroSection />
      <ThesisVisualizationDemo />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
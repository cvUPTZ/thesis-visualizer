import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] to-[#0A0D14] opacity-90" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <GraduationCap className="w-20 h-20 mx-auto text-[#6B46C1]" />
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Write Your Thesis with{" "}
            <span className="bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A powerful platform designed to help you structure, write, and
            visualize your academic thesis with ease.
          </p>
          <div className="flex justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8"
              onClick={() => {
                toast({
                  title: "Welcome!",
                  description: "Let's get started with your thesis journey.",
                });
                navigate('/auth');
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#6B46C1] text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
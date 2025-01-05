import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, Star, Shield, RocketLaunch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    {
      icon: BookOpen,
      title: "Smart Editor",
      description: "Write and format your thesis with our intelligent editor"
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together with advisors and peers seamlessly"
    },
    {
      icon: Shield,
      title: "Version Control",
      description: "Track changes and manage different versions effortlessly"
    },
    {
      icon: RocketLaunch,
      title: "AI-Powered",
      description: "Get intelligent suggestions and formatting assistance"
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "0",
      features: [
        "Basic Thesis Editor",
        "Export to PDF/DOCX",
        "Basic Templates",
        "14-day access"
      ]
    },
    {
      name: "Standard",
      price: "3,900",
      popular: true,
      features: [
        "Everything in Basic",
        "Real-time Collaboration",
        "Version Control",
        "Citation Management",
        "AI Writing Assistant",
        "6 months access"
      ]
    },
    {
      name: "Research",
      price: "13,900",
      features: [
        "Everything in Standard",
        "Priority Support",
        "Custom Templates",
        "Multiple Thesis Support",
        "Advanced Analytics",
        "Unlimited access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14]">
      {/* Hero Section */}
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
                  const demoSection = document.getElementById('features');
                  demoSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1A1F2C]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Powerful Features for Academic Success
            </h2>
            <p className="text-gray-400">
              Everything you need to write a professional thesis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#2D3748] p-6 rounded-xl hover:bg-[#2D3748]/80 transition-all"
              >
                <feature.icon className="w-12 h-12 text-[#6B46C1] mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-400">
              Select the perfect plan for your academic journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-[#2D3748] p-8 rounded-xl ${
                  plan.popular ? 'border-2 border-[#6B46C1]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#6B46C1] text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400"> DZD</span>
                    <p className="text-sm text-gray-400">per thesis</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-300">
                        <Star className="w-5 h-5 text-[#6B46C1] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[#6B46C1] hover:bg-[#553C9A] text-white'
                        : 'bg-[#2D3748] hover:bg-[#6B46C1] text-white border border-[#6B46C1]'
                    }`}
                    onClick={() => navigate('/auth')}
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#6B46C1] mb-4">
                Thesis Visualizer
              </h3>
              <p>Making thesis writing easier</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-[#6B46C1] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#6B46C1] transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-[#6B46C1] transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#6B46C1] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-[#6B46C1] transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#6B46C1] transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} Thesis Visualizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
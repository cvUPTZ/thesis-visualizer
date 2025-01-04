import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingTier = ({ 
  title, 
  price, 
  features, 
  popular = false,
  buttonVariant = "outline"
}: { 
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
  buttonVariant?: "outline" | "default";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative ${
      popular ? 'border-2 border-primary' : ''
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">Popular</span>
      </div>
    )}
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-6">{price}<span className="text-lg text-gray-500">/month</span></p>
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full" variant={buttonVariant}>
      {title === "Enterprise" ? "Contact Sales" : "Get Started"}
    </Button>
  </motion.div>
);

export const PricingSection = () => {
  const pricingTiers = [
    {
      title: "Free",
      price: "$0",
      features: [
        "Basic Thesis Editor",
        "Export to PDF/DOCX",
        "Basic Templates"
      ]
    },
    {
      title: "Pro",
      price: "$10",
      features: [
        "Everything in Free",
        "Real-time Collaboration",
        "Version Control",
        "Citation Management",
        "AI Writing Assistant"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Priority Support",
        "Custom Templates",
        "Advanced Analytics",
        "Custom Integrations"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <p className="text-gray-600">
            Select the perfect plan for your thesis writing journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={tier.title}
              {...tier}
              buttonVariant={tier.popular ? "default" : "outline"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
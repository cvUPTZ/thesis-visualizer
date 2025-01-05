import React from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingTier = ({ 
  title, 
  price, 
  features, 
  popular = false,
  buttonVariant = "outline",
  duration = "per thesis"
}: { 
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
  buttonVariant?: "outline" | "default";
  duration?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-gradient-to-b from-white to-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all relative ${
      popular ? 'border-2 border-admin-accent-primary' : ''
    }`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-admin-accent-primary to-admin-accent-secondary text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    <h3 className="text-2xl font-bold mb-4 text-admin-accent-primary">{title}</h3>
    <div className="mb-6">
      <p className="text-4xl font-bold text-admin-accent-secondary">{price}</p>
      <p className="text-sm text-gray-500">{duration}</p>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="w-5 h-5 text-admin-accent-primary mr-2 flex-shrink-0" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/auth" className="block">
      <Button 
        className={`w-full ${
          buttonVariant === "default" 
            ? "bg-gradient-to-r from-admin-accent-primary to-admin-accent-secondary hover:opacity-90 text-white" 
            : "border-admin-accent-primary/20 text-admin-accent-primary hover:border-admin-accent-secondary"
        }`} 
        variant={buttonVariant}
      >
        {title === "Enterprise" ? "Contact Sales" : "Get Started"}
      </Button>
    </Link>
  </motion.div>
);

export const PricingSection = () => {
  const pricingTiers = [
    {
      title: "Basic",
      price: "0 DZD",
      duration: "one thesis",
      features: [
        "Basic Thesis Editor",
        "Export to PDF/DOCX",
        "Basic Templates",
        "14-day access"
      ]
    },
    {
      title: "Standard",
      price: "3,900 DZD",
      duration: "per thesis",
      features: [
        "Everything in Basic",
        "Real-time Collaboration",
        "Version Control",
        "Citation Management",
        "AI Writing Assistant",
        "6 months access"
      ],
      popular: true
    },
    {
      title: "Research",
      price: "13,900 DZD",
      duration: "yearly",
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-admin-accent-primary to-admin-accent-secondary"
          >
            Choose Your Plan
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your academic journey - from single thesis to ongoing research
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

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All prices are in Algerian Dinars (DZD). Need a custom plan? 
            <Link to="/contact" className="text-admin-accent-primary hover:text-admin-accent-secondary ml-1">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
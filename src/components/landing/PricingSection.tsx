import React from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

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
}) => {
  const { t } = useTranslation();
  
  return (
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
          {t('common.getStarted')}
        </Button>
      </Link>
    </motion.div>
  );
};

export const PricingSection = () => {
  const { t } = useTranslation();

  const pricingTiers = [
    {
      title: t('landing.pricing.basic.title'),
      price: t('landing.pricing.basic.price'),
      duration: t('landing.pricing.basic.duration'),
      features: [
        "Basic Thesis Editor",
        "Export to PDF/DOCX",
        "Basic Templates",
        "14-day access"
      ]
    },
    {
      title: t('landing.pricing.standard.title'),
      price: t('landing.pricing.standard.price'),
      duration: t('landing.pricing.standard.duration'),
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
      title: t('landing.pricing.research.title'),
      price: t('landing.pricing.research.price'),
      duration: t('landing.pricing.research.duration'),
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
            {t('landing.pricing.title')}
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('landing.pricing.subtitle')}
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
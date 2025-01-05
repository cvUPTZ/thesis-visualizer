import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Shield, Rocket } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: t('landing.features.smartEditor.title'),
      description: t('landing.features.smartEditor.description')
    },
    {
      icon: Users,
      title: t('landing.features.collaboration.title'),
      description: t('landing.features.collaboration.description')
    },
    {
      icon: Shield,
      title: t('landing.features.versionControl.title'),
      description: t('landing.features.versionControl.description')
    },
    {
      icon: Rocket,
      title: t('landing.features.aiPowered.title'),
      description: t('landing.features.aiPowered.description')
    }
  ];

  return (
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
            {t('landing.features.title')}
          </h2>
          <p className="text-gray-400">
            {t('landing.features.subtitle')}
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
  );
};
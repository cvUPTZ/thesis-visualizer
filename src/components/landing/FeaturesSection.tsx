import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Shield, Rocket } from "lucide-react";

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
    icon: Rocket,
    title: "AI-Powered",
    description: "Get intelligent suggestions and formatting assistance"
  }
];

export const FeaturesSection = () => {
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
  );
};
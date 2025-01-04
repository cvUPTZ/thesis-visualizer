import React from "react";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  name: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
}

export const FeaturesComparison = () => {
  const features: Feature[] = [
    {
      name: "Basic Thesis Editor",
      free: true,
      pro: true,
      enterprise: true,
    },
    {
      name: "Real-time Collaboration",
      free: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "Version Control",
      free: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "Export to PDF/DOCX",
      free: true,
      pro: true,
      enterprise: true,
    },
    {
      name: "Citation Management",
      free: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "AI Writing Assistant",
      free: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "Priority Support",
      free: false,
      pro: false,
      enterprise: true,
    },
    {
      name: "Custom Templates",
      free: false,
      pro: false,
      enterprise: true,
    },
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
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your thesis writing journey
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Features</th>
                <th className="p-4 text-center">
                  <div className="font-semibold mb-1">Free</div>
                  <div className="text-sm text-gray-500">$0/month</div>
                </th>
                <th className="p-4 text-center bg-primary/5">
                  <div className="font-semibold mb-1 flex items-center justify-center gap-1">
                    Pro <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm text-gray-500">$10/month</div>
                </th>
                <th className="p-4 text-center">
                  <div className="font-semibold mb-1">Enterprise</div>
                  <div className="text-sm text-gray-500">Custom pricing</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{feature.name}</td>
                  <td className="p-4 text-center">
                    {feature.free && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    {feature.pro && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {feature.enterprise && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
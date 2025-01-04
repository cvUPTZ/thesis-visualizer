import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-[#F1F0FB] rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#9b87f5]" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
import React from "react";
import { motion } from "framer-motion";
import { Edit3, Users, GitBranch, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DemoPreview = () => {
  const features = [
    {
      icon: Edit3,
      title: "Smart Editor",
      description: "Write and format your thesis with our intelligent editor"
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together with advisors and peers seamlessly"
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Track changes and manage different versions effortlessly"
    },
    {
      icon: FileCheck,
      title: "Export Options",
      description: "Export your thesis in multiple formats including DOCX and PDF"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            See How It Works
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the power of our thesis writing platform through this interactive demo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
              <img 
                src="/placeholder.svg" 
                alt="Editor Demo" 
                className="w-full h-full object-cover"
              />
            </div>
            <Link to="/auth">
              <Button className="w-full">Try the Editor</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="p-2 bg-primary/5 rounded-lg">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
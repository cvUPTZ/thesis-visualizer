import React from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Users, MessageSquare } from "lucide-react";
import { ThesisStat } from "./ThesisStat";
import { ThesisNode } from "./ThesisNode";

export const ThesisVisualizationDemo = () => {
  const stats = [
    { id: 1, icon: BookOpen, label: "Chapitres", value: "6", target: "6" },
    { id: 2, icon: FileText, label: "Pages", value: "45", target: "120" },
    { id: 3, icon: Users, label: "Collaborateurs", value: "3", target: "5" },
    { id: 4, icon: MessageSquare, label: "Commentaires", value: "24", target: "50" },
  ];

  const nodes = [
    { id: 1, title: "Introduction", progress: 100, complete: true },
    { id: 2, title: "Revue de littérature", progress: 85, complete: false },
    { id: 3, title: "Méthodologie", progress: 60, complete: false },
    { id: 4, title: "Résultats", progress: 30, complete: false },
    { id: 5, title: "Discussion", progress: 15, complete: false },
    { id: 6, title: "Conclusion", progress: 5, complete: false },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] to-[#0A0D14] opacity-90" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 relative z-10"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Visualisez votre progression
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Suivez l'avancement de votre thèse avec notre interface intuitive
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <ThesisStat key={stat.id} {...stat} />
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F2C]/50 to-[#2A2F3C]/50 rounded-lg" />
          <div className="relative grid grid-cols-2 md:grid-cols-3 gap-6 p-8">
            {nodes.map((node, index) => (
              <ThesisNode
                key={node.id}
                {...node}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
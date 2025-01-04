import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  CheckSquare,
  Square,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';

const ThesisVisualization = () => {
  const sections = [
    { id: 1, title: 'Introduction', complete: true },
    { id: 2, title: 'Literature Review', complete: true },
    { id: 3, title: 'Methodology', complete: false },
    { id: 4, title: 'Results', complete: false },
    { id: 5, title: 'Discussion', complete: false },
    { id: 6, title: 'Conclusion', complete: false },
  ];

  const collaborators = [
    { id: 1, role: 'Author' },
    { id: 2, role: 'Supervisor' },
    { id: 3, role: 'Committee Member' },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Main Thesis Book Icon */}
          <div className="flex justify-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-primary/10 p-8 rounded-full"
            >
              <BookOpen size={64} className="text-primary" />
            </motion.div>
          </div>

          {/* Progress Circle */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-[500px] h-[500px] border-4 border-dashed border-gray-200 rounded-full"
              />
            </div>

            {/* Sections */}
            {sections.map((section, index) => {
              const angle = (index * 360) / sections.length;
              const radius = 250;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="bg-white p-4 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 w-40">
                    <div className="flex items-center gap-2">
                      {section.complete ? (
                        <CheckSquare className="text-green-500" />
                      ) : (
                        <Square className="text-gray-400" />
                      )}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Collaborators */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
              {collaborators.map((collaborator, index) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
                >
                  <Users className="text-primary" size={20} />
                  <span className="text-sm font-medium">{collaborator.role}</span>
                </motion.div>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <ArrowUp className="text-green-500" size={20} />
                <span className="text-sm font-medium">33% Complete</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <Calendar className="text-blue-500" size={20} />
                <span className="text-sm font-medium">2 Months Left</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThesisVisualization;
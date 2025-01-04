import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ChartBar,
  ChartLine,
  ChartPie
} from 'lucide-react';
import { ThesisSection } from './thesis-viz/ThesisSection';
import { StatCard } from './thesis-viz/StatCard';
import { CollaboratorBadge } from './thesis-viz/CollaboratorBadge';

export default function ThesisVisualization() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  const sections = [
    { id: 1, title: 'Introduction', complete: true, progress: 100 },
    { id: 2, title: 'Literature Review', complete: true, progress: 100 },
    { id: 3, title: 'Methodology', complete: false, progress: 45 },
    { id: 4, title: 'Results', complete: false, progress: 20 },
    { id: 5, title: 'Discussion', complete: false, progress: 10 },
    { id: 6, title: 'Conclusion', complete: false, progress: 0 },
  ];

  const collaborators = [
    { id: 1, role: 'Author', active: true },
    { id: 2, role: 'Supervisor', active: true },
    { id: 3, role: 'Committee Member', active: false },
  ];

  const stats = [
    { id: 1, icon: ChartBar, label: 'Words', value: '12,450', target: '15,000' },
    { id: 2, icon: ChartLine, label: 'Citations', value: '45', target: '50' },
    { id: 3, icon: ChartPie, label: 'Progress', value: '45%', target: '100%' },
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          {/* Central Book Icon with Pulse Effect */}
          <div className="flex justify-center mb-16">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
              <div className="bg-primary/10 p-8 rounded-full relative z-10">
                <BookOpen size={64} className="text-primary" />
              </div>
            </motion.div>
          </div>

          {/* Progress Circle */}
          <div className="relative h-[800px]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-[600px] h-[600px] border-4 border-dashed border-gray-200 rounded-full" />
            </motion.div>

            {/* Sections */}
            {sections.map((section, index) => (
              <ThesisSection
                key={section.id}
                section={section}
                angle={(index * 360) / sections.length}
                radius={300}
                hoveredSection={hoveredSection}
                onHover={setHoveredSection}
              />
            ))}

            {/* Stats */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 flex gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  target={stat.target}
                  index={index}
                />
              ))}
            </div>

            {/* Collaborators */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 flex gap-4">
              {collaborators.map((collaborator, index) => (
                <CollaboratorBadge
                  key={collaborator.id}
                  role={collaborator.role}
                  active={collaborator.active}
                  index={index}
                />
              ))}
            </div>

            {/* Timeline Indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12"
            >
              <div className="bg-white p-4 rounded-xl shadow-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <span className="text-sm font-medium">Timeline</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Started: 3 months ago</p>
                  <p className="text-xs text-gray-500">Deadline: 2 months left</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
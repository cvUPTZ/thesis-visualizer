import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  CheckSquare,
  Square,
  ArrowUp,
  Calendar,
  ChartBar,
  ChartLine,
  ChartPie,
  Clock
} from 'lucide-react';
import { CollaboratorOrbit } from './CollaboratorOrbit';
import { Progress } from "@/components/ui/progress";

// Types
interface Section {
  id: number;
  title: string;
  complete: boolean;
  progress: number;
  summary: string;
}

// Data
const sections: Section[] = [
  { id: 1, title: 'Introduction', complete: true, progress: 100, summary: 'Research background and objectives' },
  { id: 2, title: 'Literature Review', complete: true, progress: 100, summary: 'Theoretical framework' },
  { id: 3, title: 'Methodology', complete: false, progress: 75, summary: 'Research design' },
  { id: 4, title: 'Results', complete: false, progress: 40, summary: 'Data analysis' },
  { id: 5, title: 'Discussion', complete: false, progress: 20, summary: 'Interpretation' },
  { id: 6, title: 'Conclusion', complete: false, progress: 10, summary: 'Summary' }
];

const collaborators = [
  { id: 1, name: "John Doe", role: "Author", email: "john@example.com" },
  { id: 2, name: "Dr. Smith", role: "Supervisor", email: "smith@example.com" },
  { id: 3, name: "Prof. Johnson", role: "Committee", email: "johnson@example.com" },
  { id: 4, name: "Dr. Williams", role: "Reviewer", email: "williams@example.com" }
];

// Calculate positions on circle
const getPositionOnCircle = (index: number, total: number, radius: number) => {
  const angle = (index * 360) / total;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return { x, y };
};

export default function EnhancedThesisViz() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [progress] = useState(65);

  return (
    <div className="relative w-full h-[800px] bg-gradient-to-b from-white to-gray-50 overflow-hidden rounded-3xl">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: [
            'radial-gradient(600px circle at 50% 50%, rgba(79,70,229,0.05), transparent 80%)',
            'radial-gradient(800px circle at 50% 50%, rgba(79,70,229,0.08), transparent 80%)'
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Central Book Icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute -inset-32 border-2 border-dashed border-primary/20 rounded-full" />
        </motion.div>
        
        <motion.div
          className="relative z-10 bg-white p-8 rounded-full shadow-xl"
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <BookOpen size={48} className="text-primary relative z-10" />
        </motion.div>

        {/* Timeline Progress Ring */}
        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-16 h-16">
                <Progress
                  value={progress}
                  className="h-16 w-16 [&>div]:h-16 [&>div]:w-16 rotate-[-90deg]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-gray-600">
                <p className="font-medium">{progress}% Complete</p>
                <p>2 months left</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Collaborators Orbit */}
      <CollaboratorOrbit collaborators={collaborators} />

      {/* Sections */}
      {sections.map((section, index) => {
        const position = getPositionOnCircle(index, sections.length, 250);
        return (
          <motion.div
            key={section.id}
            className="absolute top-1/2 left-1/2"
            style={{
              x: position.x,
              y: position.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <motion.div
              className={`bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 border border-primary/10
                         ${hoveredSection === section.id ? 'ring-2 ring-primary/20' : ''}`}
              whileHover={{ scale: 1.05, y: -5 }}
              onHoverStart={() => setHoveredSection(section.id)}
              onHoverEnd={() => setHoveredSection(null)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {section.complete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckSquare className="text-green-500" />
                    </motion.div>
                  ) : (
                    <Square className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">{section.title}</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${section.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <AnimatePresence>
                  {hoveredSection === section.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-500"
                    >
                      {section.summary}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChartBar,
  ChartLine,
  ChartPie,
  CheckSquare,
  Square,
  Clock,
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ThesisProgressMapProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
  };
}

export const ThesisProgressMap = ({ stats }: ThesisProgressMapProps) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const totalProgress = Math.round((stats.completed / stats.total) * 100);

  const sections = [
    { id: 'introduction', title: 'Introduction', progress: 100, complete: true },
    { id: 'literature', title: 'Literature Review', progress: 85, complete: false },
    { id: 'methodology', title: 'Methodology', progress: 60, complete: false },
    { id: 'results', title: 'Results', progress: 40, complete: false },
    { id: 'discussion', title: 'Discussion', progress: 20, complete: false },
    { id: 'conclusion', title: 'Conclusion', progress: 10, complete: false },
  ];

  const getPositionOnCircle = (index: number, total: number, radius: number) => {
    const angle = (index * 360) / total + 90;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-3xl overflow-hidden shadow-lg">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.03),transparent_50%)]" />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: [
            'radial-gradient(600px circle at 50% 50%, rgba(79,70,229,0.02), transparent 80%)',
            'radial-gradient(800px circle at 50% 50%, rgba(79,70,229,0.04), transparent 80%)'
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Central Progress Indicator */}
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
            className="absolute inset-0 bg-primary/5 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <BookOpen size={48} className="text-primary relative z-10" />
        </motion.div>

        {/* Progress Ring */}
        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-16 h-16">
              <Progress
                value={totalProgress}
                className="h-16 w-16 [&>div]:h-16 [&>div]:w-16 rotate-[-90deg]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="font-medium text-sm text-primary">{totalProgress}% Complete</p>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Nodes */}
      {sections.map((section, index) => {
        const position = getPositionOnCircle(index, sections.length, 200);
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
              className={`bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 border border-primary/10
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
                    <Square className="text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-primary">{section.title}</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${section.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{section.progress}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    section.complete 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {section.complete ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Stats Display */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
          <ChartBar className="text-primary h-5 w-5" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-primary">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
          <ChartLine className="text-primary h-5 w-5" />
          <div>
            <p className="text-xs text-muted-foreground">In Progress</p>
            <p className="text-lg font-semibold text-primary">{stats.inProgress}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
          <ChartPie className="text-primary h-5 w-5" />
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold text-primary">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/10 rounded-full"
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
};
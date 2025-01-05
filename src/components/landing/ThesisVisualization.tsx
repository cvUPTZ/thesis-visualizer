import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  BookOpen,
  Users,
  CheckSquare,
  Square,
  Calendar,
  ChartBar,
  ChartLine,
  ChartPie,
  AlertCircle
} from 'lucide-react';

interface Section {
  id: number;
  title: string;
  complete: boolean;
  progress: number;
  dependencies?: number[];
  riskLevel?: 'low' | 'medium' | 'high';
  x?: number;  // Added x property
  y?: number;  // Added y property
}

interface Collaborator {
  id: number;
  role: string;
  active: boolean;
  lastActive?: string;
  avatar?: string;
}

const ThesisVisualization: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const controls = useAnimation();

  const sections: Section[] = [
    { 
      id: 1, 
      title: 'Introduction', 
      complete: true, 
      progress: 100,
      riskLevel: 'low',
      dependencies: [] 
    },
    { 
      id: 2, 
      title: 'Literature Review', 
      complete: true, 
      progress: 100,
      riskLevel: 'low',
      dependencies: [1] 
    },
    { 
      id: 3, 
      title: 'Methodology', 
      complete: false, 
      progress: 45,
      riskLevel: 'medium',
      dependencies: [2] 
    },
    // ... Add more sections with dependencies and risk levels
  ];

  const stats = [
    {
      id: 1,
      icon: ChartBar,
      label: 'Words',
      value: '12,450',
      target: '15,000',
      trend: '+15% this week'
    },
    // ... Enhanced stats
  ];

  // Dynamic rotation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setRotationAngle(prev => (prev + 1) % 360);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Pulse animation for active sections
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    }
  };

  // Progress update animation
  const updateProgress = async (sectionId: number, newProgress: number) => {
    await controls.start({
      width: `${newProgress}%`,
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  };

  // Calculate positions for sections
  const calculateSectionPosition = (index: number, totalSections: number, radius: number) => {
    const angle = (index * 360) / totalSections;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Update sections with positions
  const sectionsWithPositions = sections.map((section, index) => {
    const position = calculateSectionPosition(index, sections.length, 300);
    return {
      ...section,
      x: position.x,
      y: position.y,
    };
  });

  // Dynamic connection lines between dependent sections
  const DrawConnections: React.FC = () => {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {sectionsWithPositions.map(section => {
          if (section.dependencies) {
            return section.dependencies.map(depId => {
              const fromSection = sectionsWithPositions.find(s => s.id === depId);
              const toSection = section;
              // Calculate line positions based on section positions
              return (
                <motion.path
                  key={`${depId}-${section.id}`}
                  d={`M ${fromSection?.x} ${fromSection?.y} L ${toSection.x} ${toSection.y}`}
                  stroke="url(#gradient)"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              );
            });
          }
          return null;
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Risk indicator component
  const RiskIndicator: React.FC<{ level: Section['riskLevel'] }> = ({ level }) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500'
    };

    return (
      <motion.div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${colors[level || 'low']}`}
        whileHover={{ scale: 1.5 }}
      />
    );
  };

  // Interactive timeline component
  const Timeline: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(3);
    const totalMonths = 6;

    return (
      <div className="absolute bottom-0 w-full h-8 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${(currentMonth / totalMonths) * 100}%` }}
          animate={{ width: `${(currentMonth / totalMonths) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        {/* Add month markers and labels */}
      </div>
    );
  };

  // Main render
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: rotationAngle }}
        transition={{ duration: 0.1, ease: "linear" }}
      >
        <DrawConnections />
        
        {/* Sections */}
        <AnimatePresence>
          {sectionsWithPositions.map((section, index) => {
            return (
              <motion.div
                key={section.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${section.x}px)`,
                  top: `calc(50% + ${section.y}px)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  ...((activeSectionId === section.id) && pulseAnimation)
                }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                onClick={() => setActiveSectionId(section.id)}
              >
                {/* Section content */}
                <div className="relative p-4 bg-white rounded-lg shadow-lg">
                  <RiskIndicator level={section.riskLevel} />
                  {/* Section details */}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Central visualization */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Add central visualization elements */}
        </motion.div>

        <Timeline />
      </motion.div>
    </div>
  );
};

export default ThesisVisualization;

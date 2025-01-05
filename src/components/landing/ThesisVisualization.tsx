import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, CheckSquare, Square, Calendar } from 'lucide-react';
import { CentralIcon } from './visualization/CentralIcon';
import { SectionCard } from './visualization/SectionCard';
import { StatCard } from './visualization/StatCard';
import { CollaboratorCard } from './visualization/CollaboratorCard';
import { TimelineIndicator } from './visualization/TimelineIndicator';
import { NotificationsPanel } from './visualization/NotificationsPanel';
import { styles } from './visualization/styles';

// Types
interface Section {
  id: number;
  title: string;
  complete: boolean;
  progress: number;
  lastUpdated: string;
  wordCount: number;
  citations: number;
  summary: string;
}

interface Collaborator {
  id: number;
  role: string;
  active: boolean;
  name: string;
  lastActive: string;
  contributions: number;
  avatar?: string;
}

interface Stat {
  id: number;
  icon: any;
  label: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

// Data
const sections: Section[] = [
  {
    id: 1,
    title: 'Introduction',
    complete: true,
    progress: 100,
    lastUpdated: '2024-01-02',
    wordCount: 2500,
    citations: 12,
    summary: 'Research background and objectives'
  },
  {
    id: 2,
    title: 'Literature Review',
    complete: true,
    progress: 100,
    lastUpdated: '2024-01-15',
    wordCount: 4000,
    citations: 45,
    summary: 'Theoretical framework and previous studies'
  },
  {
    id: 3,
    title: 'Methodology',
    complete: false,
    progress: 75,
    lastUpdated: '2024-02-01',
    wordCount: 3000,
    citations: 18,
    summary: 'Research design and methods'
  },
  {
    id: 4,
    title: 'Results',
    complete: false,
    progress: 40,
    lastUpdated: '2024-02-15',
    wordCount: 2000,
    citations: 8,
    summary: 'Data analysis and findings'
  },
  {
    id: 5,
    title: 'Discussion',
    complete: false,
    progress: 20,
    lastUpdated: '2024-02-20',
    wordCount: 1500,
    citations: 15,
    summary: 'Interpretation of results'
  },
  {
    id: 6,
    title: 'Conclusion',
    complete: false,
    progress: 10,
    lastUpdated: '2024-02-25',
    wordCount: 800,
    citations: 5,
    summary: 'Summary and future work'
  }
];

const collaborators: Collaborator[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Author',
    active: true,
    lastActive: '2 minutes ago',
    contributions: 156
  },
  {
    id: 2,
    name: 'Dr. Smith',
    role: 'Supervisor',
    active: true,
    lastActive: '1 hour ago',
    contributions: 45
  },
  {
    id: 3,
    name: 'Prof. Johnson',
    role: 'Committee Member',
    active: false,
    lastActive: '2 days ago',
    contributions: 12
  }
];

const stats: Stat[] = [
  {
    id: 1,
    icon: BookOpen,
    label: 'Words',
    value: '13,800',
    target: '20,000',
    trend: 'up',
    change: '+15%'
  },
  {
    id: 2,
    icon: Users,
    label: 'Citations',
    value: '103',
    target: '150',
    trend: 'up',
    change: '+8%'
  },
  {
    id: 3,
    icon: Calendar,
    label: 'Overall Progress',
    value: '57%',
    target: '100%',
    trend: 'stable',
    change: '0%'
  }
];

// Main component
export default function ThesisVisualization() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeView, setActiveView] = useState<'progress' | 'timeline' | 'collaboration'>('progress');

  // Calculate positions
  const getPositionOnCircle = (index: number, total: number) => {
    const radius = 300;
    const angle = ((index * 360) / total) + 90; // Offset by 90 degrees
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    const checkDeadlines = () => {
      const incompleteSections = sections.filter(s => !s.complete);
      if (incompleteSections.length > 0) {
        setShowNotifications(true);
      }
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="thesis-container">
        <motion.div
          className="visualization-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CentralIcon />

          <div className="sections-circle">
            {sections.map((section, index) => {
              const position = getPositionOnCircle(index, sections.length);
              return (
                <SectionCard
                  key={section.id}
                  section={section}
                  position={position}
                  onHoverStart={() => setHoveredSection(section.id)}
                  onHoverEnd={() => setHoveredSection(null)}
                />
              );
            })}
          </div>

          <motion.div 
            className="stats-dashboard"
            variants={containerVariants}
          >
            {stats.map((stat) => (
              <StatCard key={stat.id} {...stat} />
            ))}
          </motion.div>

          <motion.div
            className="collaboration-panel"
            variants={containerVariants}
          >
            {collaborators.map((collaborator) => (
              <CollaboratorCard key={collaborator.id} {...collaborator} />
            ))}
          </motion.div>

          <TimelineIndicator />

          <NotificationsPanel
            showNotifications={showNotifications}
            sections={sections}
          />
        </motion.div>
      </div>
    </>
  );
}

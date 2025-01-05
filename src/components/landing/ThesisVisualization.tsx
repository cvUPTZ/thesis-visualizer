import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Users, CheckSquare, Square, Calendar,
  ChartBar, ChartLine, ChartPie, Clock, AlertCircle,
  FileText, GitBranch, MessageSquare, Award, ArrowUp,
  ArrowDown, Minus
} from 'lucide-react';

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

// Styles
const styles = `
  .thesis-viz {
    --primary-color: #4F46E5;
    --secondary-color: #E5E7EB;
    --success-color: #10B981;
    --warning-color: #F59E0B;
    --error-color: #EF4444;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --bg-primary: #FFFFFF;
    --bg-secondary: #F9FAFB;
  }

  .thesis-container {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    padding: 2rem;
    overflow: hidden;
  }

  .visualization-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .central-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .central-icon-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--primary-color);
    opacity: 0.2;
    animation: pulse 2s infinite;
  }

  .sections-circle {
    position: relative;
    width: 800px;
    height: 800px;
    margin: 0 auto;
  }

  .section-card {
    position: absolute;
    width: 200px;
    background: var(--bg-primary);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    transition: all 0.3s ease;
  }

  .section-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: var(--secondary-color);
    border-radius: 2px;
    margin: 0.5rem 0;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.5s ease;
  }

  .stats-dashboard {
    position: absolute;
    top: 2rem;
    right: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: var(--bg-primary);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .collaboration-panel {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
  }

  .collaborator-card {
    background: var(--bg-primary);
    padding: 0.75rem 1rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .notifications-panel {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.2;
    }
  }

  @media (max-width: 1024px) {
    .sections-circle {
      transform: scale(0.8);
    }
    
    .stats-dashboard {
      position: relative;
      top: 0;
      right: 0;
      margin-top: 2rem;
    }
  }
`;

const EnhancedThesisVisualization = () => {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeView, setActiveView] = useState<'progress' | 'timeline' | 'collaboration'>('progress');

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
      icon: ChartBar,
      label: 'Words',
      value: '13,800',
      target: '20,000',
      trend: 'up',
      change: '+15%'
    },
    {
      id: 2,
      icon: ChartLine,
      label: 'Citations',
      value: '103',
      target: '150',
      trend: 'up',
      change: '+8%'
    },
    {
      id: 3,
      icon: ChartPie,
      label: 'Overall Progress',
      value: '57%',
      target: '100%',
      trend: 'stable',
      change: '0%'
    }
  ];

  // Calculate positions
  const getPositionOnCircle = (index: number, total: number) => {
    const radius = 300;
    const angle = (index * 360) / total;
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Effects
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
          {/* Central Icon */}
          <motion.div 
            className="central-icon"
            whileHover={{ scale: 1.1 }}
          >
            <div className="central-icon-pulse" />
            <BookOpen size={64} className="text-primary" />
          </motion.div>

          {/* Sections Circle */}
          <div className="sections-circle">
            {sections.map((section, index) => {
              const position = getPositionOnCircle(index, sections.length);
              return (
                <motion.div
                  key={section.id}
                  className="section-card"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`
                  }}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setHoveredSection(section.id)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <div className="section-header">
                    <h3>{section.title}</h3>
                    {section.complete ? (
                      <CheckSquare className="text-success" />
                    ) : (
                      <Square className="text-secondary" />
                    )}
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${section.progress}%` }}
                    />
                  </div>
                  <div className="section-details">
                    <span>{section.wordCount} words</span>
                    <span>{section.citations} citations</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Dashboard */}
          <motion.div 
            className="stats-dashboard"
            variants={containerVariants}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                className="stat-card"
                variants={itemVariants}
              >
                <div className="stat-header">
                  <stat.icon size={20} />
                  <span>{stat.label}</span>
                </div>
                <div className="stat-value">
                  {stat.value}
                  <span className="stat-target">/ {stat.target}</span>
                </div>
                <div className={`stat-trend ${stat.trend}`}>
                  {stat.trend === 'up' && <ArrowUp size={16} />}
                  {stat.trend === 'down' && <ArrowDown size={16} />}
                  {stat.trend === 'stable' && <Minus size={16} />}
                  <span>{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Collaboration Panel */}
          <motion.div
            className="collaboration-panel"
            variants={containerVariants}
          >
            {collaborators.map((collaborator) => (
              <motion.div
                key={collaborator.id}
                className="collaborator-card"
                variants={itemVariants}
              >
                <Users size={20} />
                <div className="collaborator-info">
                  <span>{collaborator.name}</span>
                  <span>{collaborator.role}</span>
                </div>
                {collaborator.active && (
                  <div className="active-indicator" />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Notifications */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="notifications-panel"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <div className="notification-header">
                  <AlertCircle size={20} />
                  <span>Thesis Updates</span>
                </div>
                <div className="notification-content">
                  {sections
                    .filter(s => !s.complete)
                    .map(section => (
                      <div key={section.id} className="notification-item">
                        <span>{section.title} needs attention</span>
                        <span>{section.progress}% complete</span>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export { EnhancedThesisVisualization };
export default EnhancedThesisVisualization;

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { BookOpen, Users, CheckSquare, Square, Calendar } from 'lucide-react';
// import { CentralIcon } from './visualization/CentralIcon';
// import { SectionCard } from './visualization/SectionCard';
// import { StatCard } from './visualization/StatCard';
// import { CollaboratorCard } from './visualization/CollaboratorCard';
// import { TimelineIndicator } from './visualization/TimelineIndicator';
// import { NotificationsPanel } from './visualization/NotificationsPanel';
// import { styles } from './visualization/styles';

// // Types
// interface Section {
//   id: number;
//   title: string;
//   complete: boolean;
//   progress: number;
//   lastUpdated: string;
//   wordCount: number;
//   citations: number;
//   summary: string;
// }

// interface Collaborator {
//   id: number;
//   role: string;
//   active: boolean;
//   name: string;
//   lastActive: string;
//   contributions: number;
//   avatar?: string;
// }

// interface Stat {
//   id: number;
//   icon: any;
//   label: string;
//   value: string;
//   target: string;
//   trend: 'up' | 'down' | 'stable';
//   change: string;
// }

// // Data
// const sections: Section[] = [
//   {
//     id: 1,
//     title: 'Introduction',
//     complete: true,
//     progress: 100,
//     lastUpdated: '2024-01-02',
//     wordCount: 2500,
//     citations: 12,
//     summary: 'Research background and objectives'
//   },
//   {
//     id: 2,
//     title: 'Literature Review',
//     complete: true,
//     progress: 100,
//     lastUpdated: '2024-01-15',
//     wordCount: 4000,
//     citations: 45,
//     summary: 'Theoretical framework and previous studies'
//   },
//   {
//     id: 3,
//     title: 'Methodology',
//     complete: false,
//     progress: 75,
//     lastUpdated: '2024-02-01',
//     wordCount: 3000,
//     citations: 18,
//     summary: 'Research design and methods'
//   },
//   {
//     id: 4,
//     title: 'Results',
//     complete: false,
//     progress: 40,
//     lastUpdated: '2024-02-15',
//     wordCount: 2000,
//     citations: 8,
//     summary: 'Data analysis and findings'
//   },
//   {
//     id: 5,
//     title: 'Discussion',
//     complete: false,
//     progress: 20,
//     lastUpdated: '2024-02-20',
//     wordCount: 1500,
//     citations: 15,
//     summary: 'Interpretation of results'
//   },
//   {
//     id: 6,
//     title: 'Conclusion',
//     complete: false,
//     progress: 10,
//     lastUpdated: '2024-02-25',
//     wordCount: 800,
//     citations: 5,
//     summary: 'Summary and future work'
//   }
// ];

// const collaborators: Collaborator[] = [
//   {
//     id: 1,
//     name: 'John Doe',
//     role: 'Author',
//     active: true,
//     lastActive: '2 minutes ago',
//     contributions: 156
//   },
//   {
//     id: 2,
//     name: 'Dr. Smith',
//     role: 'Supervisor',
//     active: true,
//     lastActive: '1 hour ago',
//     contributions: 45
//   },
//   {
//     id: 3,
//     name: 'Prof. Johnson',
//     role: 'Committee Member',
//     active: false,
//     lastActive: '2 days ago',
//     contributions: 12
//   }
// ];

// const stats: Stat[] = [
//   {
//     id: 1,
//     icon: BookOpen,
//     label: 'Words',
//     value: '13,800',
//     target: '20,000',
//     trend: 'up',
//     change: '+15%'
//   },
//   {
//     id: 2,
//     icon: Users,
//     label: 'Citations',
//     value: '103',
//     target: '150',
//     trend: 'up',
//     change: '+8%'
//   },
//   {
//     id: 3,
//     icon: Calendar,
//     label: 'Overall Progress',
//     value: '57%',
//     target: '100%',
//     trend: 'stable',
//     change: '0%'
//   }
// ];

// // Main component
// export default function ThesisVisualization() {
//   const [hoveredSection, setHoveredSection] = useState<number | null>(null);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [activeView, setActiveView] = useState<'progress' | 'timeline' | 'collaboration'>('progress');

//   // Calculate positions
//   const getPositionOnCircle = (index: number, total: number) => {
//     const radius = 300;
//     const angle = ((index * 360) / total) + 90; // Offset by 90 degrees
//     const x = Math.cos((angle * Math.PI) / 180) * radius;
//     const y = Math.sin((angle * Math.PI) / 180) * radius;
//     return { x, y };
//   };

//   // Animations
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   useEffect(() => {
//     const checkDeadlines = () => {
//       const incompleteSections = sections.filter(s => !s.complete);
//       if (incompleteSections.length > 0) {
//         setShowNotifications(true);
//       }
//     };

//     checkDeadlines();
//     const interval = setInterval(checkDeadlines, 3600000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="thesis-container">
//         <motion.div
//           className="visualization-wrapper"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <CentralIcon />

//           <div className="sections-circle">
//             {sections.map((section, index) => {
//               const position = getPositionOnCircle(index, sections.length);
//               return (
//                 <SectionCard
//                   key={section.id}
//                   section={section}
//                   position={position}
//                   onHoverStart={() => setHoveredSection(section.id)}
//                   onHoverEnd={() => setHoveredSection(null)}
//                 />
//               );
//             })}
//           </div>

//           <motion.div 
//             className="stats-dashboard"
//             variants={containerVariants}
//           >
//             {stats.map((stat) => (
//               <StatCard key={stat.id} {...stat} />
//             ))}
//           </motion.div>

//           <motion.div
//             className="collaboration-panel"
//             variants={containerVariants}
//           >
//             {collaborators.map((collaborator) => (
//               <CollaboratorCard key={collaborator.id} {...collaborator} />
//             ))}
//           </motion.div>

//           <TimelineIndicator />

//           <NotificationsPanel
//             showNotifications={showNotifications}
//             sections={sections}
//           />
//         </motion.div>
//       </div>
//     </>
//   );
// }









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
  ChartPie
} from 'lucide-react';

// Custom styles for the visualization
const customStyles = `
  /* Flex positioning adjustments */
  .thesis-viz .flex .flex {
    position: relative;
    top: 10px;
  }

  .thesis-viz .stats-flex:nth-child(1) {
    top: 15px;
    transform: translatex(-15px) translatey(31px) !important;
  }

  .thesis-viz .stats-flex:nth-child(2) {
    transform: translatex(-3px) translatey(36px) !important;
  }

  .thesis-viz .stats-flex:nth-child(3) {
    transform: translatex(9px) translatey(37px) !important;
  }

  .thesis-viz .book-icon-container {
    top: 0px;
  }

  .thesis-viz .central-flex {
    position: relative;
    top: -16px;
    transform: translatex(0px) translatey(-44px);
  }

  .thesis-viz .stats-card {
    transform: translatex(35px) translatey(-63px) !important;
    position: relative;
    left: -33px;
  }

  .thesis-viz .timeline-card {
    transform: translatex(394px) translatey(-199px);
    width: 101%;
  }
`;

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
    <>
      <style>{customStyles}</style>
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden thesis-viz">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative central-flex"
          >
            {/* Central Book Icon with Pulse Effect */}
            <div className="flex justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative book-icon-container"
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
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[600px] h-[600px] border-4 border-dashed border-gray-200 rounded-full" />
              </motion.div>

              {/* Sections */}
              {sections.map((section, index) => {
                const angle = (index * 360) / sections.length;
                const radius = 300;
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
                    onHoverStart={() => setHoveredSection(section.id)}
                    onHoverEnd={() => setHoveredSection(null)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`bg-white p-4 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 transition-colors ${
                        hoveredSection === section.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {section.complete ? (
                            <CheckSquare className="text-green-500" />
                          ) : (
                            <Square className="text-gray-400" />
                          )}
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${section.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="bg-primary rounded-full h-2"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Stats */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 flex gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`stats-card bg-white px-6 py-3 rounded-xl shadow-lg stats-flex-${index + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-lg font-semibold">
                          {stat.value}
                          <span className="text-xs text-gray-400 ml-1">/ {stat.target}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Collaborators */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12 flex gap-4">
                {collaborators.map((collaborator, index) => (
                  <motion.div
                    key={collaborator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
                      collaborator.active ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <Users className={collaborator.active ? 'text-primary' : 'text-gray-400'} size={20} />
                      {collaborator.active && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      collaborator.active ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {collaborator.role}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Timeline Indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 timeline-card"
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
    </>
  );
}
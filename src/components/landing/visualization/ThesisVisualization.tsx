import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Users, CheckSquare, Square, Calendar,
  ChartBar, ChartLine, ChartPie, Clock, AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis, Section } from '@/types/thesis';

export default function ThesisVisualization() {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [stats, setStats] = useState({
    words: 0,
    citations: 0,
    progress: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestThesis = async () => {
      try {
        console.log('Fetching latest thesis data...');
        const { data: latestThesis, error } = await supabase
          .from('theses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (latestThesis) {
          console.log('Latest thesis found:', latestThesis);
          setThesis(latestThesis);

          // Extract sections from thesis content
          const allSections = [
            ...(latestThesis.content?.frontMatter || []),
            ...(latestThesis.content?.chapters?.flatMap(c => c.sections) || []),
            ...(latestThesis.content?.backMatter || [])
          ];

          setSections(allSections);

          // Calculate stats
          const totalWords = allSections.reduce((sum, section) => 
            sum + (section.content?.split(/\s+/).length || 0), 0);
          
          const totalCitations = allSections.reduce((sum, section) =>
            sum + (section.citations?.length || 0), 0);

          const completedSections = allSections.filter(s => s.content?.trim().length > 0).length;
          const progressPercentage = (completedSections / allSections.length) * 100;

          setStats({
            words: totalWords,
            citations: totalCitations,
            progress: Math.round(progressPercentage)
          });
        }
      } catch (error: any) {
        console.error('Error fetching thesis:', error);
        toast({
          title: "Error loading thesis data",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    fetchLatestThesis();
  }, [toast]);

  // Calculate positions for the visualization
  const getPositionOnCircle = (index: number, total: number) => {
    const radius = 300;
    const angle = (index * 360) / total;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Animation variants
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
      transition: { duration: 0.5 }
    }
  };

  return (
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
          <BookOpen size={64} className="text-primary relative z-10" />
          <div className="absolute inset-0 bg-primary/5 rounded-full" />
        </motion.div>

        {/* Sections Circle */}
        <div className="sections-circle">
          {sections.map((section, index) => {
            const position = getPositionOnCircle(index, sections.length);
            const isComplete = section.content?.trim().length > 0;

            return (
              <motion.div
                key={section.id}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${position.x}px, ${position.y}px)`
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredSection(index)}
                onHoverEnd={() => setHoveredSection(null)}
              >
                <div className="bg-white p-4 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    {isComplete ? (
                      <CheckSquare className="text-green-500 h-4 w-4" />
                    ) : (
                      <Square className="text-gray-400 h-4 w-4" />
                    )}
                    <span className="text-sm font-medium truncate">{section.title}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${isComplete ? 100 : 0}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Dashboard */}
        <motion.div 
          className="absolute top-4 right-4 flex gap-4"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="stat-card">
            <ChartBar className="h-5 w-5 text-primary" />
            <div className="ml-2">
              <p className="text-sm text-gray-600">Words</p>
              <p className="text-lg font-semibold">{stats.words.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card">
            <ChartLine className="h-5 w-5 text-primary" />
            <div className="ml-2">
              <p className="text-sm text-gray-600">Citations</p>
              <p className="text-lg font-semibold">{stats.citations}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="stat-card">
            <ChartPie className="h-5 w-5 text-primary" />
            <div className="ml-2">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold">{stats.progress}%</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          variants={itemVariants}
        >
          <div className="bg-white p-4 rounded-xl shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-5 w-5" />
              <span className="text-sm font-medium">Timeline</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                Created: {thesis?.created_at ? new Date(thesis.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {thesis?.updated_at ? new Date(thesis.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .thesis-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          padding: 2rem;
          overflow: hidden;
        }

        .visualization-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          height: 800px;
        }

        .central-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          padding: 2rem;
          border-radius: 9999px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .sections-circle {
          position: relative;
          width: 800px;
          height: 800px;
          margin: 0 auto;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          min-width: 150px;
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
      `}</style>
    </div>
  );
}
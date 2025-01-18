import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useThesisData } from '@/hooks/useThesisData';
import { BookOpen, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ThesisVisualization() {
  const { thesisId } = useParams();
  const { thesis, isLoading } = useThesisData(thesisId);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  if (isLoading || !thesis) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <BookOpen className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  // Calculate overall progress
  const allSections = [
    ...thesis.frontMatter,
    ...thesis.chapters.flatMap(chapter => chapter.sections),
    ...thesis.backMatter
  ];
  
  const completedSections = allSections.filter(section => 
    section.content && section.content.trim().length > 100
  ).length;
  
  const totalProgress = Math.round((completedSections / allSections.length) * 100);

  // Calculate chapter completion status
  const chapterStatus = thesis.chapters.map(chapter => {
    const completedChapterSections = chapter.sections.filter(
      section => section.content && section.content.trim().length > 100
    ).length;
    return {
      title: chapter.title,
      progress: Math.round((completedChapterSections / chapter.sections.length) * 100),
      complete: completedChapterSections === chapter.sections.length
    };
  });

  // Get time metrics
  const createdDate = new Date(thesis.created_at);
  const lastUpdateDate = new Date(thesis.updated_at);
  const daysSinceCreation = Math.round((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate positions for chapter nodes
  const getPositionOnCircle = (index: number, total: number) => {
    const radius = 300;
    const angle = ((index * 360) / total) + 90;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

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
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-[600px] h-[600px] border-4 border-dashed border-gray-200 rounded-full" />
            </motion.div>

            {/* Chapter Nodes */}
            {chapterStatus.map((chapter, index) => {
              const position = getPositionOnCircle(index, chapterStatus.length);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                  onHoverStart={() => setHoveredSection(index)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`bg-white p-4 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 transition-colors ${
                      hoveredSection === index ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {chapter.complete ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <AlertCircle className="text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">{chapter.title}</span>
                      </div>
                      <Progress value={chapter.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">{chapter.progress}% Complete</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Stats */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 flex gap-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white px-6 py-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                    <p className="text-lg font-semibold">{totalProgress}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white px-6 py-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Time Active</p>
                    <p className="text-lg font-semibold">{daysSinceCreation} days</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Last Update */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12"
            >
              <div className="bg-white p-4 rounded-xl shadow-lg space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-primary" size={20} />
                  <span className="text-sm font-medium">Last Update</span>
                </div>
                <p className="text-xs text-gray-500">
                  {lastUpdateDate.toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Thesis } from '@/types/thesis';
import { motion } from 'framer-motion';
import { ThesisNode } from './ThesisNode';
import { CollaboratorOrbit } from './CollaboratorOrbit';
import { CentralIcon } from './CentralIcon';
import { NotificationsPanel } from './NotificationsPanel';
import { StatCard } from './StatCard';

interface ThesisVisualizationProps {
  initialData?: Partial<Thesis>;
}

export const ThesisVisualization: React.FC<ThesisVisualizationProps> = ({ initialData }) => {
  const [thesis, setThesis] = useState<Thesis>({
    id: '',
    title: '',
    content: {},
    metadata: {
      description: '',
      keywords: [],
      createdAt: new Date().toISOString(),
      universityName: '',
      departmentName: '',
      authorName: '',
      thesisDate: '',
      committeeMembers: []
    },
    frontMatter: [],
    chapters: [],
    backMatter: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    user_id: '',
    language: 'en'
  });

  useEffect(() => {
    if (initialData) {
      setThesis(prevThesis => ({
        ...prevThesis,
        ...initialData,
        createdAt: initialData.createdAt || new Date(),
        updatedAt: initialData.updatedAt || new Date()
      }));
    }
  }, [initialData]);

  const sections = [
    ...(Array.isArray(thesis.frontMatter) ? thesis.frontMatter : []),
    ...(Array.isArray(thesis.chapters) ? thesis.chapters.flatMap(chapter => chapter.sections || []) : []),
    ...(Array.isArray(thesis.backMatter) ? thesis.backMatter : [])
  ];

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-background to-background/50 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CentralIcon thesis={thesis} />
        <CollaboratorOrbit thesis={thesis} />
        
        {sections.map((section, index) => (
          <ThesisNode
            key={section.id}
            section={section}
            index={index}
            total={sections.length}
          />
        ))}

        <NotificationsPanel thesis={thesis} />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <StatCard
            title="Sections"
            value={sections.length.toString()}
            trend={sections.length > 0 ? 'up' : 'stable'}
          />
          <StatCard
            title="Progress"
            value={Math.round((sections.filter(s => s.content?.length > 0).length / Math.max(sections.length, 1)) * 100).toString()}
            suffix="%"
            trend="up"
          />
        </div>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, FileText, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MainContentProps {
  sections: Section[];
  chapters: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  onAddChapter?: (chapter: Chapter) => void;
}

export const MainContentSections: React.FC<MainContentProps> = ({
  sections,
  chapters,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter
}) => {
  console.log('MainContentSections rendering with:', {
    sectionsCount: sections?.length,
    chaptersCount: chapters?.length,
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
  });

  const mainContentGroups = [
    {
      title: "Introduction",
      icon: FolderOpen,
      types: [
        { type: 'general-introduction' as ThesisSectionType, label: 'General Introduction', icon: FileText },
        { type: 'general-context' as ThesisSectionType, label: 'General Context', icon: FileText },
        { type: 'problem-statement' as ThesisSectionType, label: 'Problem Statement', icon: FileText },
        { type: 'research-questions' as ThesisSectionType, label: 'Research Questions', icon: FileText },
        { type: 'objectives' as ThesisSectionType, label: 'Objectives', icon: FileText },
        { type: 'hypotheses' as ThesisSectionType, label: 'Hypotheses', icon: FileText },
        { type: 'thesis-structure' as ThesisSectionType, label: 'Thesis Structure', icon: FileText }
      ]
    },
    {
      title: "Literature Review",
      icon: FolderOpen,
      types: [
        { type: 'literature-review' as ThesisSectionType, label: 'Literature Review', icon: FileText },
        { type: 'theoretical-framework' as ThesisSectionType, label: 'Theoretical Framework', icon: FileText },
        { type: 'main-theories' as ThesisSectionType, label: 'Main Theories', icon: FileText },
        { type: 'key-concepts' as ThesisSectionType, label: 'Key Concepts', icon: FileText },
        { type: 'state-of-art' as ThesisSectionType, label: 'State of Art', icon: FileText },
        { type: 'critical-synthesis' as ThesisSectionType, label: 'Critical Synthesis', icon: FileText }
      ]
    },
    {
      title: "Methodology",
      icon: FolderOpen,
      types: [
        { type: 'methodology' as ThesisSectionType, label: 'Methodology', icon: FileText },
        { type: 'research-design' as ThesisSectionType, label: 'Research Design', icon: FileText },
        { type: 'methodological-approach' as ThesisSectionType, label: 'Methodological Approach', icon: FileText },
        { type: 'population-sample' as ThesisSectionType, label: 'Population & Sample', icon: FileText },
        { type: 'research-field' as ThesisSectionType, label: 'Research Field', icon: FileText },
        { type: 'data-collection' as ThesisSectionType, label: 'Data Collection', icon: FileText },
        { type: 'research-protocol' as ThesisSectionType, label: 'Research Protocol', icon: FileText }
      ]
    },
    {
      title: "Results & Discussion",
      icon: FolderOpen,
      types: [
        { type: 'results' as ThesisSectionType, label: 'Results', icon: FileText },
        { type: 'descriptive-analysis' as ThesisSectionType, label: 'Descriptive Analysis', icon: FileText },
        { type: 'statistical-tests' as ThesisSectionType, label: 'Statistical Tests', icon: FileText },
        { type: 'hypothesis-testing' as ThesisSectionType, label: 'Hypothesis Testing', icon: FileText },
        { type: 'results-summary' as ThesisSectionType, label: 'Results Summary', icon: FileText },
        { type: 'discussion' as ThesisSectionType, label: 'Discussion', icon: FileText },
        { type: 'results-interpretation' as ThesisSectionType, label: 'Results Interpretation', icon: FileText }
      ]
    },
    {
      title: "Conclusion",
      icon: FolderOpen,
      types: [
        { type: 'conclusion' as ThesisSectionType, label: 'General Conclusion', icon: FileText }
      ]
    },
    {
      title: "Appendices",
      icon: FolderOpen,
      types: [
        { type: 'appendix' as ThesisSectionType, label: 'Appendix', icon: FileText }
      ]
    }
  ];

  const handleSectionSelect = (sectionId: string) => {
    console.log('MainContentSections - Section selected:', sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      console.log('MainContentSections - Found section:', { id: section.id, title: section.title, type: section.type });
      onSectionSelect(sectionId);
    } else {
      console.warn('MainContentSections - Section not found:', sectionId);
    }
  };

  const handleAddSection = (type: ThesisSectionType, label: string) => {
    console.log('🎯 handleAddSection called with:', { type, label });
    if (onAddSection) {
      console.log('🚀 Calling onAddSection with type:', type);
      onAddSection(type);
      console.log('✅ onAddSection called successfully');
    } else {
      console.warn('⚠️ onAddSection is not defined');
    }
  };

  const renderSectionButton = (section: Section) => {
    const typeInfo = mainContentGroups
      .flatMap(group => group.types)
      .find(t => t.type === section.type);
    
    const Icon = typeInfo?.icon || FileText;
    
    return (
      <motion.button
        key={section.id}
        onClick={() => handleSectionSelect(section.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all",
          "hover:bg-primary/5 hover:shadow-sm",
          activeSection === section.id && "bg-primary/10 text-primary font-medium shadow-sm"
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="h-4 w-4 opacity-70" />
        <span className="truncate">{section.title}</span>
      </motion.button>
    );
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="sync">
        {mainContentGroups.map((group) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-3"
          >
            <div className="flex items-center gap-2 mb-4">
              {React.createElement(group.icon, { 
                className: "h-5 w-5 text-primary/70" 
              })}
              <h3 className="text-sm font-semibold text-primary">{group.title}</h3>
            </div>
            
            <div className="space-y-1">
              <AnimatePresence mode="sync">
                {sections
                  .filter(section => 
                    group.types.some(type => type.type === section.type)
                  )
                  .map(section => renderSectionButton(section))}
                
                {group.types.map(({ type, label, icon: Icon }) => {
                  const sectionExists = sections.some(s => s.type === type);
                  if (!sectionExists) {
                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2"
                          onClick={() => handleAddSection(type, label)}
                        >
                          <Plus className="h-4 w-4" />
                          <Icon className="h-4 w-4" />
                          <span>Add {label}</span>
                        </Button>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
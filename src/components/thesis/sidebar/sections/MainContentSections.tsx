import React from 'react';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, FileText, Microscope, ChartBar, MessageSquare, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    activeSection
  });

  const mainContentGroups = [
    {
      title: "Introduction",
      types: [
        { type: 'general-introduction', label: 'General Introduction', icon: BookOpen },
        { type: 'general-context', label: 'General Context', icon: FileText },
        { type: 'problem-statement', label: 'Problem Statement', icon: MessageSquare },
        { type: 'research-questions', label: 'Research Questions', icon: MessageSquare },
        { type: 'objectives', label: 'Objectives', icon: CheckSquare },
        { type: 'hypotheses', label: 'Hypotheses', icon: FileText },
        { type: 'thesis-structure', label: 'Thesis Structure', icon: FileText }
      ]
    },
    {
      title: "Literature Review",
      types: [
        { type: 'literature-review', label: 'Literature Review', icon: BookOpen },
        { type: 'theoretical-framework', label: 'Theoretical Framework', icon: FileText },
        { type: 'main-theories', label: 'Main Theories', icon: FileText },
        { type: 'key-concepts', label: 'Key Concepts', icon: FileText },
        { type: 'state-of-art', label: 'State of Art', icon: ChartBar },
        { type: 'critical-synthesis', label: 'Critical Synthesis', icon: FileText },
        { type: 'conceptual-framework', label: 'Conceptual Framework', icon: FileText }
      ]
    },
    {
      title: "Methodology",
      types: [
        { type: 'methodology', label: 'Methodology', icon: Microscope },
        { type: 'research-design', label: 'Research Design', icon: FileText },
        { type: 'methodological-approach', label: 'Methodological Approach', icon: FileText },
        { type: 'population-sample', label: 'Population & Sample', icon: FileText },
        { type: 'research-field', label: 'Research Field', icon: FileText },
        { type: 'data-collection', label: 'Data Collection', icon: FileText },
        { type: 'research-protocol', label: 'Research Protocol', icon: FileText }
      ]
    },
    {
      title: "Results & Discussion",
      types: [
        { type: 'results', label: 'Results', icon: ChartBar },
        { type: 'descriptive-analysis', label: 'Descriptive Analysis', icon: ChartBar },
        { type: 'statistical-tests', label: 'Statistical Tests', icon: ChartBar },
        { type: 'hypothesis-testing', label: 'Hypothesis Testing', icon: CheckSquare },
        { type: 'results-summary', label: 'Results Summary', icon: FileText },
        { type: 'discussion', label: 'Discussion', icon: MessageSquare },
        { type: 'results-interpretation', label: 'Results Interpretation', icon: FileText }
      ]
    }
  ];

  const renderAddButton = (type: ThesisSectionType, label: string, Icon: React.ElementType) => {
    if (sections.some(s => s.type === type)) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2"
        onClick={() => onAddSection?.(type)}
      >
        <Plus className="h-4 w-4" />
        <Icon className="h-4 w-4" />
        <span>Add {label}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="px-3">
        <h3 className="text-sm font-semibold text-primary mb-4">Main Content</h3>
        
        {mainContentGroups.map((group, index) => (
          <div key={group.title} className={cn("space-y-3", index > 0 && "mt-6")}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {group.title}
            </div>
            
            <div className="space-y-2">
              {sections
                .filter(section => 
                  group.types.some(type => type.type === section.type)
                )
                .map(section => {
                  const typeInfo = group.types.find(t => t.type === section.type);
                  const Icon = typeInfo?.icon || FileText;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionSelect(section.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                        "hover:bg-primary/5",
                        activeSection === section.id && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Icon className="h-4 w-4 opacity-70" />
                      {section.title}
                    </button>
                  );
                })}
              
              {group.types.map(({ type, label, icon: Icon }) => 
                renderAddButton(type as ThesisSectionType, label, Icon)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
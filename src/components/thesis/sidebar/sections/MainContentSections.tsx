import React from 'react';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, FileText, Microscope, ChartBar, MessageSquare, 
  CheckSquare, GraduationCap, Library, Flask, PieChart,
  ScrollText, Lightbulb, Target, List, GitBranch, Search,
  BookMarked, BookCopy, Compass, Database, LineChart, Brain,
  Presentation, ArrowRight, Plus
} from 'lucide-react';
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
      icon: BookOpen,
      types: [
        { type: 'general-introduction', label: 'General Introduction', icon: BookOpen },
        { type: 'general-context', label: 'General Context', icon: GraduationCap },
        { type: 'problem-statement', label: 'Problem Statement', icon: Target },
        { type: 'research-questions', label: 'Research Questions', icon: Search },
        { type: 'objectives', label: 'Objectives', icon: Target },
        { type: 'hypotheses', label: 'Hypotheses', icon: Lightbulb },
        { type: 'thesis-structure', label: 'Thesis Structure', icon: GitBranch }
      ]
    },
    {
      title: "Literature Review",
      icon: Library,
      types: [
        { type: 'literature-review', label: 'Literature Review', icon: BookMarked },
        { type: 'theoretical-framework', label: 'Theoretical Framework', icon: BookCopy },
        { type: 'main-theories', label: 'Main Theories', icon: Brain },
        { type: 'key-concepts', label: 'Key Concepts', icon: Lightbulb },
        { type: 'state-of-art', label: 'State of Art', icon: Compass },
        { type: 'critical-synthesis', label: 'Critical Synthesis', icon: MessageSquare },
        { type: 'conceptual-framework', label: 'Conceptual Framework', icon: GitBranch }
      ]
    },
    {
      title: "Methodology",
      icon: Flask,
      types: [
        { type: 'methodology', label: 'Methodology', icon: Flask },
        { type: 'research-design', label: 'Research Design', icon: GitBranch },
        { type: 'methodological-approach', label: 'Methodological Approach', icon: Compass },
        { type: 'population-sample', label: 'Population & Sample', icon: Database },
        { type: 'research-field', label: 'Research Field', icon: Target },
        { type: 'data-collection', label: 'Data Collection', icon: Database },
        { type: 'research-protocol', label: 'Research Protocol', icon: ScrollText }
      ]
    },
    {
      title: "Results & Discussion",
      icon: ChartBar,
      types: [
        { type: 'results', label: 'Results', icon: ChartBar },
        { type: 'descriptive-analysis', label: 'Descriptive Analysis', icon: LineChart },
        { type: 'statistical-tests', label: 'Statistical Tests', icon: PieChart },
        { type: 'hypothesis-testing', label: 'Hypothesis Testing', icon: CheckSquare },
        { type: 'results-summary', label: 'Results Summary', icon: ScrollText },
        { type: 'discussion', label: 'Discussion', icon: MessageSquare },
        { type: 'results-interpretation', label: 'Results Interpretation', icon: Brain }
      ]
    },
    {
      title: "Conclusion",
      icon: Presentation,
      types: [
        { type: 'conclusion', label: 'Conclusion', icon: Presentation },
        { type: 'general-summary', label: 'General Summary', icon: ScrollText },
        { type: 'main-contributions', label: 'Main Contributions', icon: Target },
        { type: 'overall-limitations', label: 'Overall Limitations', icon: List },
        { type: 'future-perspectives', label: 'Future Perspectives', icon: Lightbulb },
        { type: 'recommendations', label: 'Recommendations', icon: ArrowRight }
      ]
    }
  ];

  const renderSectionButton = (section: Section, icon: React.ElementType) => (
    <button
      key={section.id}
      onClick={() => onSectionSelect(section.id)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        "hover:bg-primary/5",
        activeSection === section.id && "bg-primary/10 text-primary font-medium"
      )}
    >
      {React.createElement(icon, { className: "h-4 w-4 opacity-70" })}
      <span className="truncate">{section.title}</span>
    </button>
  );

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
      {mainContentGroups.map((group) => (
        <div key={group.title} className="px-3">
          <div className="flex items-center gap-2 mb-4">
            {React.createElement(group.icon, { className: "h-5 w-5 text-primary/70" })}
            <h3 className="text-sm font-semibold text-primary">{group.title}</h3>
          </div>
          
          <div className="space-y-2">
            {sections
              .filter(section => 
                group.types.some(type => type.type === section.type)
              )
              .map(section => {
                const typeInfo = group.types.find(t => t.type === section.type);
                return renderSectionButton(section, typeInfo?.icon || FileText);
              })}
            
            {group.types.map(({ type, label, icon }) => 
              renderAddButton(type as ThesisSectionType, label, icon)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
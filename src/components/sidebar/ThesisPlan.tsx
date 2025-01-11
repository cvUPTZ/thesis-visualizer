import React from 'react';
import { Section } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from '@/components/ui/checkbox';

interface ThesisPlanProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onUpdateSectionData: (section: Section) => void;
}

export const ThesisPlan: React.FC<ThesisPlanProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onUpdateSectionData
}) => {
  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleStatusChange = (sectionId: string, taskId: string, checked: boolean) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedTasks = section.tasks.map(task =>
      task.id === taskId ? { ...task, status: checked ? 'completed' : 'pending', priority: task.priority || 'medium' } : task
    );

    onUpdateSectionData({
      ...section,
      tasks: updatedTasks
    });
  };

  const renderSectionItem = (section: Section) => (
    <div key={section.id} className="space-y-2">
      <button
        onClick={() => onSectionSelect(section.id)}
        className={cn(
          "w-full text-left px-3 py-2 rounded-md text-sm",
          "hover:bg-editor-hover transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
          "flex items-center gap-2 group",
          activeSection === section.id && "bg-editor-active text-editor-accent font-medium"
        )}
      >
        <span className="truncate">{section.title || 'Untitled Section'}</span>
      </button>
      <ul className="ml-4 space-y-1">
        {(section.tasks || []).map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.status === 'completed'}
                onCheckedChange={(checked) => handleStatusChange(section.id, task.id, checked as boolean)}
                id={task.id}
              />
              <span className="text-sm">{task.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const frontMatterSections = sections.filter(section => 
    ['title', 'abstract', 'acknowledgments'].includes(section.type || '')
  );
  
  const mainContentSections = sections.filter(section =>
    !['title', 'abstract', 'acknowledgments', 'references', 'appendix'].includes(section.type || '')
  );
  
  const backMatterSections = sections.filter(section =>
    ['references', 'appendix'].includes(section.type || '')
  );

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-4">
        {frontMatterSections.length > 0 && (
          <Collapsible
            open={openSections.includes('frontMatter')}
            onOpenChange={() => toggleSection('frontMatter')}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium hover:bg-editor-hover rounded-md">
              {openSections.includes('frontMatter') ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <BookOpen className="w-4 h-4 mr-2" />
              Front Matter
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1">
              {frontMatterSections.map(renderSectionItem)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {mainContentSections.length > 0 && (
          <Collapsible
            open={openSections.includes('mainContent')}
            onOpenChange={() => toggleSection('mainContent')}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium hover:bg-editor-hover rounded-md">
              {openSections.includes('mainContent') ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <BookOpen className="w-4 h-4 mr-2" />
              Main Content
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1">
              {mainContentSections.map(renderSectionItem)}
            </CollapsibleContent>
          </Collapsible>
        )}

        {backMatterSections.length > 0 && (
          <Collapsible
            open={openSections.includes('backMatter')}
            onOpenChange={() => toggleSection('backMatter')}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium hover:bg-editor-hover rounded-md">
              {openSections.includes('backMatter') ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <BookOpen className="w-4 h-4 mr-2" />
              Back Matter
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1">
              {backMatterSections.map(renderSectionItem)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </ScrollArea>
  );
};
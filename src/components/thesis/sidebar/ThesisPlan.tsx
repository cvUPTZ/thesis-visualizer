import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ThesisPlanProps {
    sections: any[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onUpdateSectionData: (section: any) => void;
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
      const updatedSections = sections.map(section => {
        if (section.id === sectionId){
            const updatedTasks = section.tasks.map((task: any) =>
              task.id === taskId ? { ...task, status: checked ? 'completed' : 'pending' } : task
            );

            return {...section, tasks: updatedTasks};
        }
        return section
      });
      
        onUpdateSectionData(updatedSections);
    };


  const renderSectionItem = (section: any) => {
      return (
        <div key={section.id} className="space-y-2">
            <button
              onClick={() => onSectionSelect(section.id)}
               className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm",
                   "hover:bg-editor-hover transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
                 "flex items-center gap-2 group"
                 ,
                  activeSection === section.id && "bg-editor-active text-editor-accent font-medium"
                )}
            >
               <span className="truncate">{section.title || 'Untitled Section'}</span>
            </button>
              <ul className="ml-4 space-y-1">
                {(section.tasks || []).map((task: any) => (
                  <li key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={task.status === 'completed'}
                        onCheckedChange={(e) => handleStatusChange(section.id, task.id, e)}
                        id={task.id}
                      />
                      <span className="text-sm">{task.description}</span>
                    </div>
                  </li>
                  ))}
              </ul>
          </div>
      );
    };

  const renderCollapsibleSection = (
    title: string,
    sectionsList: any[],
    sectionKey: string,
    icon: React.ReactNode
  ) => (
    <Collapsible
      key={sectionKey}
      open={openSections.includes(sectionKey)}
      onOpenChange={() => toggleSection(sectionKey)}
      className="space-y-1"
    >
      <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-medium hover:bg-editor-hover rounded-md">
        {openSections.includes(sectionKey) ? (
          <ChevronDown className="w-4 h-4 mr-2" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2" />
        )}
        {icon}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {sectionsList.map(renderSectionItem)}
      </CollapsibleContent>
    </Collapsible>
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
    <div className="space-y-4">
           {frontMatterSections.length > 0 && (
          renderCollapsibleSection(
            'Front Matter',
            frontMatterSections,
            'frontMatter',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
        {mainContentSections.length > 0 && (
          renderCollapsibleSection(
            'Main Content',
            mainContentSections,
            'mainContent',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
        {backMatterSections.length > 0 && (
          renderCollapsibleSection(
            'Back Matter',
            backMatterSections,
            'backMatter',
            <BookOpen className="w-4 h-4 mr-2" />
          )
        )}
    </div>
  );
};
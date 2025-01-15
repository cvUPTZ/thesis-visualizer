import React from 'react';
import { Section } from '@/types/thesis';
import { cn } from '@/lib/utils';
import { CollaboratorLocation } from '@/components/collaboration/CollaboratorLocation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskList } from './TaskList';
import { FileText, BookOpen, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  thesisId: string;
  onUpdateSectionData: (section: Section) => void;
  onAddSectionTask: (sectionId: string) => void;
  onUpdateSectionTask: (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
  onChangeSectionTaskDescription: (sectionId: string, taskId: string, newDescription: string) => void;
}

export const TableOfContents = ({
  sections = [],
  activeSection,
  onSectionSelect,
  thesisId,
  onUpdateSectionData,
  onAddSectionTask,
  onUpdateSectionTask,
  onChangeSectionTaskDescription,
}: TableOfContentsProps) => {
  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter']);
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleAddSection = (type: 'frontMatter' | 'mainContent' | 'backMatter') => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: 'New Section',
      content: '',
      type: 'custom',
      order: sections.length,
      figures: [],
      tables: [],
      citations: [],
      tasks: []
    };

    onUpdateSectionData(newSection);
    
    toast({
      title: "Section Added",
      description: "New section has been created successfully.",
    });
  };

  // Group sections by type
  const frontMatterSections = sections.filter(section => 
    ['title', 'abstract', 'acknowledgments'].includes(section.type || '')
  );
  
  const mainContentSections = sections.filter(section =>
    !['title', 'abstract', 'acknowledgments', 'references', 'appendix'].includes(section.type || '')
  );
  
  const backMatterSections = sections.filter(section =>
    ['references', 'appendix'].includes(section.type || '')
  );

  const renderSectionItem = (section: Section) => (
    <div key={section.id} className="space-y-2">
      <button
        onClick={() => onSectionSelect(section.id)}
        className={cn(
          "w-full text-left px-3 py-2 rounded-md text-sm",
          "hover:bg-editor-hover transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
          "flex items-center justify-between group",
          activeSection === section.id && "bg-editor-active text-editor-accent font-medium"
        )}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-editor-text group-hover:text-editor-accent transition-colors" />
          <span className="truncate">{section.title || 'Untitled Section'}</span>
        </div>
      </button>
      <TaskList
        tasks={section.tasks}
        onUpdateTask={(taskId, status) => onUpdateSectionTask(section.id, taskId, status)}
        onAddTask={() => onAddSectionTask(section.id)}
        onChangeTaskDescription={(taskId, newDescription) => onChangeSectionTaskDescription(section.id, taskId, newDescription)}
      />
    </div>
  );

  const renderCollapsibleSection = (
    title: string,
    sectionsList: Section[],
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
        <span className="flex-1">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleAddSection(sectionKey as 'frontMatter' | 'mainContent' | 'backMatter');
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {sectionsList.map(renderSectionItem)}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {renderCollapsibleSection(
          'Front Matter',
          frontMatterSections,
          'frontMatter',
          <BookOpen className="w-4 h-4 mr-2" />
        )}
        {renderCollapsibleSection(
          'Main Content',
          mainContentSections,
          'mainContent',
          <BookOpen className="w-4 h-4 mr-2" />
        )}
        {renderCollapsibleSection(
          'Back Matter',
          backMatterSections,
          'backMatter',
          <BookOpen className="w-4 h-4 mr-2" />
        )}
      </div>
    </ScrollArea>
  );
};
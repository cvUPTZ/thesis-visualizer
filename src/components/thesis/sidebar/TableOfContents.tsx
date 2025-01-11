import React from 'react';
import { Section } from '@/types/thesis';
import { cn } from '@/lib/utils';
import { CollaboratorLocation } from '@/components/collaboration/CollaboratorLocation';
import { supabase } from '@/integrations/supabase/client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskList } from './TaskList';
import { FileText, BookOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  thesisId: string;
   onUpdateSectionData: (section: Section) => void;
  onAddSectionTask: (sectionId: string) => void;
  onUpdateSectionTask: (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
    onChangeSectionTaskDescription: (sectionId: string, taskId: string, newDescription: string) => void
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
  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter', 'figures', 'tables']);
  const [collaboratorLocations, setCollaboratorLocations] = React.useState<Record<string, any>>({});
  const presenceChannel = React.useRef<any>(null);

  React.useEffect(() => {
    if (!thesisId) return;

    // Set up presence channel
    presenceChannel.current = supabase.channel(`thesis:${thesisId}`);
    
    presenceChannel.current
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.current?.presenceState() || {};
        console.log('Presence state updated:', state);
        setCollaboratorLocations(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Track user's current section
          await presenceChannel.current?.track({
            user_id: user.id,
            email: user.email,
            section_id: activeSection,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
    };
  }, [thesisId]);

  // Update presence when active section changes
  React.useEffect(() => {
    const updatePresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !presenceChannel.current) return;

      await presenceChannel.current?.track({
        user_id: user.id,
        email: user.email,
        section_id: activeSection,
        online_at: new Date().toISOString(),
      });
    };

    updatePresence();
  }, [activeSection]);

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

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getCollaboratorsInSection = (sectionId: string) => {
    return Object.values(collaboratorLocations)
      .flat()
      .filter((presence: any) => presence.section_id === sectionId);
  };

  const renderSectionItem = (section: Section) => {
    const collaborators = getCollaboratorsInSection(section.id);

    return (
      <button
        key={section.id}
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
         {collaborators.length > 0 && (
          <div className="flex -space-x-2">
            {collaborators.map((collaborator: any) => (
              <CollaboratorLocation 
                key={collaborator.user_id} 
                collaborator={collaborator}
              />
            ))}
          </div>
        )}
      </button>
    );
  };

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
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1">
        {sectionsList.map(section => (
          <div className="space-y-2">
            {renderSectionItem(section)}
            <TaskList
                tasks={section.tasks}
                onUpdateTask={(taskId, status) => onUpdateSectionTask(section.id, taskId, status)}
                onAddTask={() => onAddSectionTask(section.id)}
                onChangeTaskDescription={(taskId, newDescription)=> onChangeSectionTaskDescription(section.id, taskId, newDescription)}
              />
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );

  const renderElementsList = (
    title: string,
    elements: Array<{ id: string; title: string; parentSection: string }>,
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
        {elements.map(element => (
          <button
            key={element.id}
            onClick={() => onSectionSelect(element.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm",
              "hover:bg-editor-hover transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editor-accent",
              "flex flex-col gap-1",
              activeSection === element.id && "bg-editor-active text-editor-accent font-medium"
            )}
          >
            <span className="truncate font-medium">{element.title}</span>
            <span className="text-xs text-editor-text-light truncate">
              {element.parentSection}
            </span>
          </button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
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
    </ScrollArea>
  );
};
import React from 'react';
import { Section } from '@/types/thesis';
import { TableOfContents } from './sidebar/TableOfContents';
import { cn } from '@/lib/utils';
import { CollaboratorLocation } from '@/components/collaboration/CollaboratorLocation';
import { supabase } from '@/integrations/supabase/client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThesisPlan } from './sidebar/ThesisPlan';
import { BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react';

interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  thesisId: string;
  onUpdateSectionData: (section: Section) => void;
    onAddSectionTask: (sectionId: string) => void;
    onUpdateSectionTask: (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
    onChangeSectionTaskDescription: (sectionId: string, taskId: string, newDescription: string) => void
}

export const ThesisSidebar = ({
  sections = [],
  activeSection,
  onSectionSelect,
  thesisId,
    onUpdateSectionData,
    onAddSectionTask,
    onUpdateSectionTask,
     onChangeSectionTaskDescription,
}: ThesisSidebarProps) => {
  const [openSections, setOpenSections] = React.useState<string[]>(['frontMatter', 'mainContent', 'backMatter', 'figures', 'tables']);
  const [collaboratorLocations, setCollaboratorLocations] = React.useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = React.useState('content');
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
  const validSections = Array.isArray(sections) ? sections.filter(section => 
    section && typeof section === 'object' && 'id' in section && 'title' in section
  ) : [];
  
  return (
    <aside className="w-64 h-full bg-editor-bg border-r border-editor-border">
      <div className="sticky top-0 z-10 bg-editor-bg border-b border-editor-border p-4">
        <h2 className="text-lg font-serif font-medium text-editor-text">Contents</h2>
      </div>
      <div className="p-4 space-y-4">
         <div className="flex gap-2">
            <Button variant={activeTab === 'content' ? 'default' : 'outline'} size="sm" onClick={()=>setActiveTab('content')}>Contents</Button>
            <Button variant={activeTab === 'plan' ? 'default' : 'outline'} size="sm" onClick={()=>setActiveTab('plan')}>Plan</Button>
         </div>
          {activeTab === 'content' && <TableOfContents
            sections={validSections}
            activeSection={activeSection}
            onSectionSelect={onSectionSelect}
            thesisId={thesisId}
            onUpdateSectionData={onUpdateSectionData}
            onAddSectionTask={onAddSectionTask}
            onUpdateSectionTask={onUpdateSectionTask}
             onChangeSectionTaskDescription={onChangeSectionTaskDescription}
          /> }
        {activeTab === 'plan' && <ThesisPlan
            sections={validSections}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
           onUpdateSectionData={onUpdateSectionData}
          />}
      </div>
    </aside>
  );
};
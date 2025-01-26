import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { CitationManager } from '@/components/CitationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConclusionSectionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const ConclusionSectionManager: React.FC<ConclusionSectionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('ConclusionSectionManager rendering:', { sectionId: section.id });

  return (
    <Card className="p-6 space-y-4">
      <Input
        value={section.title}
        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
        className="text-xl font-serif"
        placeholder="Conclusion Title"
      />
      
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <MarkdownEditor
            value={typeof section.content === 'string' ? section.content : ''}
            onChange={(content) => onUpdate({ ...section, content })}
            placeholder="Write your conclusion here..."
          />
        </TabsContent>
        
        <TabsContent value="citations">
          <CitationManager
            citations={section.citations || []}
            thesisId={section.id}
            onCitationCreate={(citation) => onUpdate({
              ...section,
              citations: [...(section.citations || []), citation]
            })}
            onCitationUpdate={(citation) => onUpdate({
              ...section,
              citations: (section.citations || []).map(c => c.id === citation.id ? citation : c)
            })}
            onCitationDelete={(citation) => onUpdate({
              ...section,
              citations: (section.citations || []).filter(c => c.id !== citation.id)
            })}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
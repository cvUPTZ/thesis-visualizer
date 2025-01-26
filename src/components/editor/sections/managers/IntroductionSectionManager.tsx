import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { CitationManager } from '@/components/CitationManager';
import { FigureManager } from '@/components/FigureManager';
import { TableManager } from '@/components/TableManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IntroductionSectionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const IntroductionSectionManager: React.FC<IntroductionSectionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('IntroductionSectionManager rendering:', { sectionId: section.id });

  return (
    <Card className="p-6 space-y-4">
      <Input
        value={section.title}
        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
        className="text-xl font-serif"
        placeholder="Introduction Title"
      />
      
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="figures">Figures</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <MarkdownEditor
            value={typeof section.content === 'string' ? section.content : ''}
            onChange={(content) => onUpdate({ ...section, content })}
            placeholder="Write your introduction here..."
          />
        </TabsContent>
        
        <TabsContent value="figures">
          <FigureManager
            figures={section.figures || []}
            onAddFigure={(figure) => onUpdate({ 
              ...section, 
              figures: [...(section.figures || []), figure] 
            })}
            onRemoveFigure={(id) => onUpdate({
              ...section,
              figures: (section.figures || []).filter(f => f.id !== id)
            })}
            onUpdateFigure={(figure) => onUpdate({
              ...section,
              figures: (section.figures || []).map(f => f.id === figure.id ? figure : f)
            })}
          />
        </TabsContent>
        
        <TabsContent value="tables">
          <TableManager
            tables={section.tables || []}
            onAddTable={(table) => onUpdate({
              ...section,
              tables: [...(section.tables || []), table]
            })}
            onRemoveTable={(id) => onUpdate({
              ...section,
              tables: (section.tables || []).filter(t => t.id !== id)
            })}
            onUpdateTable={(table) => onUpdate({
              ...section,
              tables: (section.tables || []).map(t => t.id === table.id ? table : t)
            })}
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
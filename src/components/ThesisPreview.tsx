import React, { useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { TitlePage } from './thesis/preview/TitlePage';
import { FrenchTitlePage } from './thesis/preview/FrenchTitlePage';
import { AbstractSection } from './thesis/preview/AbstractSection';
import { ContentSection } from './thesis/preview/ContentSection';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePDF } from 'react-to-pdf';

interface ThesisPreviewProps {
  thesis: any;
  language?: 'en' | 'fr';
}

export const ThesisPreview: React.FC<ThesisPreviewProps> = ({ thesis, language = 'en' }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { toPDF, targetRef } = usePDF({
    filename: `${thesis.frontMatter[0]?.title || 'thesis'}.pdf`,
    page: { margin: 20 }
  });

  const handleExport = async () => {
    try {
      await toPDF();
      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  const handleElementClick = (id: string, type: 'figure' | 'table' | 'citation') => {
    console.log('Element clicked:', { id, type });
  };

  const handlePositionChange = (elementId: string, position: { x: number; y: number }) => {
    console.log('Position changed:', { elementId, position });
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 p-2 border-b">
        <Button onClick={handleExport} className="w-full sm:w-auto">
          <FileDown className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-10rem)] rounded-md border p-4">
        <div ref={targetRef} className="thesis-preview space-y-8">
          {language === 'en' ? (
            <TitlePage metadata={thesis.metadata} titleSection={thesis.frontMatter[0]} />
          ) : (
            <FrenchTitlePage thesis={thesis} titleSection={thesis.frontMatter[0]} />
          )}
          
          {thesis.frontMatter.map((section: any, index: number) => (
            <React.Fragment key={section.id}>
              {section.type === 'abstract' && (
                <AbstractSection abstractSection={section} />
              )}
              {section.type !== 'abstract' && (
                <ContentSection 
                  section={section}
                  elementPositions={[]}
                  onElementClick={handleElementClick}
                  onPositionChange={handlePositionChange}
                />
              )}
            </React.Fragment>
          ))}
          
          {thesis.chapters.map((chapter: any) => (
            <React.Fragment key={chapter.id}>
              {chapter.sections.map((section: any) => (
                <ContentSection
                  key={section.id}
                  section={section}
                  chapterTitle={chapter.title}
                  elementPositions={[]}
                  onElementClick={handleElementClick}
                  onPositionChange={handlePositionChange}
                />
              ))}
            </React.Fragment>
          ))}
          
          {thesis.backMatter.map((section: any) => (
            <ContentSection
              key={section.id}
              section={section}
              elementPositions={[]}
              onElementClick={handleElementClick}
              onPositionChange={handlePositionChange}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
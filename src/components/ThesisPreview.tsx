import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { TitlePage } from './thesis/preview/TitlePage';
import { FrenchTitlePage } from './thesis/preview/FrenchTitlePage';
import { AbstractSection } from './thesis/preview/AbstractSection';
import { ContentSection } from './thesis/preview/ContentSection';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePDF } from 'react-to-pdf';
import { cn } from '@/lib/utils';

interface ThesisPreviewProps {
  thesis: any;
  language?: 'en' | 'fr';
}

export const ThesisPreview: React.FC<ThesisPreviewProps> = ({ thesis, language = 'en' }) => {
  const { toast } = useToast();
  const { toPDF, targetRef } = usePDF({
    filename: `${thesis.frontMatter[0]?.title || 'thesis'}.pdf`,
    page: { 
      margin: 20,
      format: 'a4',
    }
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
        <div 
          ref={targetRef} 
          className={cn(
            "thesis-preview space-y-8 text-black dark:text-black bg-white",
            "max-w-[210mm] mx-auto" // A4 width
          )}
        >
          {/* Title Page */}
          <div className="page-break-before">
            {language === 'en' ? (
              <TitlePage metadata={thesis.metadata} titleSection={thesis.frontMatter[0]} />
            ) : (
              <FrenchTitlePage thesis={thesis} titleSection={thesis.frontMatter[0]} />
            )}
          </div>
          
          {/* Front Matter */}
          {thesis.frontMatter.map((section: any, index: number) => (
            <div 
              key={section.id} 
              className={cn(
                "page-break-before",
                "min-h-[297mm]", // A4 height
                "p-[20mm]", // Standard margins
                "relative bg-white"
              )}
            >
              {section.type === 'abstract' ? (
                <AbstractSection abstractSection={section} />
              ) : (
                <ContentSection 
                  section={section}
                  elementPositions={[]}
                  onElementClick={handleElementClick}
                  onPositionChange={handlePositionChange}
                />
              )}
            </div>
          ))}
          
          {/* Chapters */}
          {thesis.chapters.map((chapter: any) => (
            <React.Fragment key={chapter.id}>
              {chapter.sections.map((section: any) => (
                <div 
                  key={section.id} 
                  className={cn(
                    "page-break-before",
                    "min-h-[297mm]", // A4 height
                    "p-[20mm]", // Standard margins
                    "relative bg-white",
                    "shadow-sm"
                  )}
                >
                  <ContentSection
                    section={section}
                    chapterTitle={chapter.title}
                    elementPositions={[]}
                    onElementClick={handleElementClick}
                    onPositionChange={handlePositionChange}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
          
          {/* Back Matter */}
          {thesis.backMatter.map((section: any) => (
            <div 
              key={section.id} 
              className={cn(
                "page-break-before",
                "min-h-[297mm]", // A4 height
                "p-[20mm]", // Standard margins
                "relative bg-white",
                "shadow-sm"
              )}
            >
              <ContentSection
                section={section}
                elementPositions={[]}
                onElementClick={handleElementClick}
                onPositionChange={handlePositionChange}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
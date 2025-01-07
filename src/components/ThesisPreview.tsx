import React, { useState, useRef } from 'react';
import { Thesis, Section } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ElementPositionManager } from './thesis/preview/ElementPositionManager';
import { TitlePage } from './thesis/preview/TitlePage';
import { AbstractSection } from './thesis/preview/AbstractSection';
import { ContentSection } from './thesis/preview/ContentSection';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import { generatePDF } from '@react-pdf/renderer';
import { useToast } from '@/hooks/use-toast';

interface ThesisPreviewProps {
  thesis: Thesis;
}

interface ElementPosition {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: {
    x: number;
    y: number;
  };
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
  const [elementPositions, setElementPositions] = useState<ElementPosition[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  console.log('Rendering ThesisPreview with data:', thesis);

  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');

  const handleUpdatePosition = (elementId: string, position: ElementPosition) => {
    setElementPositions(prev => {
      const existing = prev.findIndex(p => p.id === elementId);
      if (existing !== -1) {
        const newPositions = [...prev];
        newPositions[existing] = position;
        return newPositions;
      }
      return [...prev, position];
    });
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;

    try {
      const { toPDF } = await import('react-to-pdf');
      await toPDF(previewRef, {
        filename: `${thesis.frontMatter[0]?.title || 'thesis'}.pdf`,
        page: {
          margin: 20,
          format: 'a4',
        },
      });
      
      toast({
        title: "Success",
        description: "Your thesis has been exported as a PDF file.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export thesis as PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderSection = (section: Section, chapterTitle?: string) => {
    if (!section) return null;

    if (section.type === 'title') {
      return <TitlePage metadata={thesis.metadata} titleSection={titleSection} />;
    }

    if (section.type === 'abstract') {
      return <AbstractSection abstractSection={abstractSection} />;
    }

    return (
      <ContentSection
        key={section.id}
        section={section}
        chapterTitle={chapterTitle}
        elementPositions={elementPositions}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export to PDF
        </Button>
      </div>
      
      <ElementPositionManager
        figures={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.figures || [])
        )}
        tables={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.tables || [])
        )}
        citations={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.citations || [])
        )}
        onUpdatePosition={handleUpdatePosition}
      />
      
      <ScrollArea className="flex-1 border rounded-md">
        <div ref={previewRef} className="thesis-preview-container p-4">
          <div className="thesis-preview space-y-6">
            {thesis.frontMatter.map((section) => renderSection(section))}
            {thesis.chapters.map((chapter) => (
              <div key={chapter.id} className="chapter-content">
                {chapter.sections.map((section) => (
                  renderSection(section, chapter.title)
                ))}
              </div>
            ))}
            {thesis.backMatter.map((section) => renderSection(section))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
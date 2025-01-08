import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { TitlePage } from './thesis/preview/TitlePage';
import { FrenchTitlePage } from './thesis/preview/FrenchTitlePage';
import { AbstractSection } from './thesis/preview/AbstractSection';
import { ContentSection } from './thesis/preview/ContentSection';
import { Button } from './ui/button';
import { FileDown, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isFullScreen, setIsFullScreen] = React.useState(false);

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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return (
    <div className="relative bg-background min-h-screen">
      <div className="sticky top-0 z-10 bg-background p-4 border-b shadow-sm flex justify-between items-center">
        <Button onClick={handleExport} className="w-full sm:w-auto">
          <FileDown className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
        <Button onClick={toggleFullScreen} variant="outline" size="icon">
          {isFullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div 
          ref={targetRef} 
          className={cn(
            "thesis-preview mx-auto py-8 px-4",
            "max-w-[210mm]", // A4 width
            "bg-white shadow-md"
          )}
        >
          {/* Title Page */}
          <div className="mb-8 bg-white rounded-lg overflow-hidden thesis-page">
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
              className="thesis-page"
            >
              {section.type === 'abstract' ? (
                <AbstractSection abstractSection={section} />
              ) : (
                <ContentSection 
                  section={section}
                  elementPositions={[]}
                  onElementClick={() => {}}
                  onPositionChange={() => {}}
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
                  className="thesis-page"
                >
                  <ContentSection
                    section={section}
                    chapterTitle={chapter.title}
                    elementPositions={[]}
                    onElementClick={() => {}}
                    onPositionChange={() => {}}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
          
          {/* Back Matter */}
          {thesis.backMatter.map((section: any) => (
            <div 
              key={section.id} 
              className="thesis-page"
            >
              <ContentSection
                section={section}
                elementPositions={[]}
                onElementClick={() => {}}
                onPositionChange={() => {}}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
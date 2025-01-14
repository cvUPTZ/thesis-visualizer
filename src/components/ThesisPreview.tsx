import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TitlePage } from '@/components/preview/TitlePage';
import { FrenchTitlePage } from '@/components/preview/FrenchTitlePage';
import { AbstractSection } from '@/components/preview/AbstractSection';
import { ContentSection } from '@/components/preview/ContentSection';
import { Button } from '@/components/ui/button';
import { FileDown, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePDF } from 'react-to-pdf';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { 
  Document,
  Packer,
  Paragraph,
  TextRun,
  PageNumber,
  Header,
  Footer,
  AlignmentType,
  Table, 
  TableRow, 
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak
} from 'docx';
import { generateTitlePage, generateChapterContent, createHeading, createParagraph } from '@/utils/docx/sectionGenerators';
import { documentStyles, pageSettings } from '@/utils/docx/documentStyles';
import { createPageNumberParagraph } from '@/utils/docx/pageNumbering';
import { convertInchesToTwip } from 'docx';

interface ThesisPreviewProps {
  thesis: any;
  language?: 'en' | 'fr';
}

export const ThesisPreview: React.FC<ThesisPreviewProps> = ({ thesis, language = 'en' }) => {
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [previewWidth, setPreviewWidth] = useState(210);
  const { toPDF, targetRef } = usePDF({
    filename: `${thesis?.frontMatter?.[0]?.title || 'thesis'}.pdf`,
    page: {
      margin: 20,
      format: 'a4',
    }
  });

  const generateTableOfContents = (chapters: { title: string; page: number }[]) => {
    if (!chapters?.length) return [];
    
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Table of Contents',
            bold: true,
            size: 28
          })
        ],
        spacing: { after: 400 },
        alignment: AlignmentType.CENTER
      }),
      ...chapters.map(chapter => 
        new Paragraph({
          children: [
            new TextRun({
              text: chapter.title,
              size: 24
            }),
            new TextRun({
              text: `  ${chapter.page}`,
              size: 24
            })
          ],
          spacing: { before: 200, after: 200 }
        })
      )
    ];
  };

  const handleExport = async () => {
    try {
      if (!thesis?.metadata) {
        throw new Error('No thesis metadata available');
      }

      const doc = new Document({
        sections: [{
          ...pageSettings.page,
          properties: {
            type: 'nextPage'
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: thesis.metadata?.title || '',
                      size: 22,
                      font: 'Times New Roman',
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                })
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                createPageNumberParagraph()
              ],
            }),
          },
          children: [
            ...generateTitlePage({
              title: thesis.metadata?.title || '',
              author: thesis.metadata?.authorName || '',
              date: thesis.metadata?.thesisDate || '',
              university: thesis.metadata?.universityName || '',
              department: thesis.metadata?.departmentName || '',
              degree: thesis.metadata?.degree || '',
            }),
            new Paragraph({ children: [new PageBreak()], spacing: { before: convertInchesToTwip(2) } }),
            new Paragraph({
              children: [new TextRun({
                text: 'Table Of Contents',
                bold: true,
                size: 32
              })],
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ children: [new PageBreak()] }),
            ...generateTableOfContents(
              thesis.chapters?.map((chapter: any, index: number) => ({
                title: chapter.title || '',
                page: index + 3
              })) || []
            ),
            new Paragraph({ children: [new PageBreak()] }),
            ...(thesis.frontMatter || [])
              .filter((section: any) => section.type !== 'title')
              .map((section: any) => {
                return new Paragraph({
                  ...section,
                  children: [
                    new TextRun({
                      text: section.content || '',
                      size: 24,
                      font: 'Times New Roman'
                    }),
                  ],
                });
              }),
            ...(thesis.chapters || []).flatMap((chapter: any) =>
              generateChapterContent(
                chapter.order,
                chapter.title || '',
                chapter.content || '',
                chapter.figures || [],
              )
            ),
            ...(thesis.backMatter || []).map((section: any) => {
              return createParagraph(section.content || '');
            }),
          ],
        }],
        styles: documentStyles
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesis.frontMatter?.[0]?.title || 'thesis'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "DOCX exported successfully",
      });
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({
        title: "Error",
        description: "Failed to export DOCX",
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

    const handleWidthChange = (value: number[]) => {
      setPreviewWidth(value[0]);
    };

    const adjustWidth = (increment: boolean) => {
      setPreviewWidth(prev => {
        const newWidth = increment ? prev + 10 : prev - 10;
        return Math.min(Math.max(newWidth, 150), 300); // Min 150mm, Max 300mm
      });
    };

  return (
    <div className="relative bg-background min-h-screen">
      <div className="sticky top-0 z-10 bg-background p-4 border-b shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <FileDown className="w-4 h-4 mr-2" />
            Export to DOCX
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={() => adjustWidth(false)} variant="outline" size="icon">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button onClick={() => adjustWidth(true)} variant="outline" size="icon">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={toggleFullScreen} variant="outline" size="icon">
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4">
          <span className="text-sm text-muted-foreground w-16">Width: {previewWidth}mm</span>
          <Slider
            value={[previewWidth]}
            onValueChange={handleWidthChange}
            min={150}
            max={300}
            step={5}
            className="w-full max-w-xs"
          />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div 
          ref={targetRef} 
          className={cn(
            "thesis-preview mx-auto py-8 px-4",
            "bg-white shadow-md"
          )}
          style={{ width: `${previewWidth}mm` }}
        >
          <div className="mb-8 bg-white rounded-lg overflow-hidden thesis-page">
            {language === 'en' ? (
              <TitlePage metadata={thesis?.metadata} titleSection={thesis?.frontMatter?.[0]} />
            ) : (
              <FrenchTitlePage thesis={thesis} titleSection={thesis?.frontMatter?.[0]} />
            )}
          </div>
            
          {(thesis?.frontMatter || []).map((section: any, index: number) => (
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
            
          {(thesis?.chapters || []).map((chapter: any) => (
            <React.Fragment key={chapter.id}>
              {(chapter.sections || []).map((section: any) => (
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
            
          {(thesis?.backMatter || []).map((section: any) => (
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

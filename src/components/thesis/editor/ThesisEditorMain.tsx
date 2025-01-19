import React from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = ({
  thesis,
  activeSection,
  showPreview,
  previewRef,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  const { toast } = useToast();
  const [showIntroEditor, setShowIntroEditor] = React.useState(false);
  
  // Check if general introduction exists and has content
  const hasGeneralIntroduction = thesis?.frontMatter.some(
    section => section.type === 'introduction' && section.content.trim().length > 0
  );

  const handleAddGeneralIntroduction = () => {
    if (!thesis) return;

    const newIntroduction: Section = {
      id: Date.now().toString(),
      title: "General Introduction",
      content: "",
      type: "introduction",
      order: thesis.frontMatter.length,
      required: true,
      figures: [],
      tables: [],
      citations: [],
      references: []
    };

    // Add the new introduction to frontMatter
    const updatedFrontMatter = [...(thesis.frontMatter || []), newIntroduction];
    
    // Update the thesis with the new front matter
    if (onContentChange) {
      onContentChange(newIntroduction.id, "");
    }
    
    setShowIntroEditor(true);
    
    toast({
      title: "General Introduction Added",
      description: "You can now start writing your general introduction",
    });
  };

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {!hasGeneralIntroduction && !showIntroEditor && (
            <div className="bg-muted/50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Start with a General Introduction</h3>
                  <p className="text-sm text-muted-foreground">
                    Before adding chapters, you need to write a general introduction for your thesis.
                  </p>
                </div>
                <Button
                  onClick={handleAddGeneralIntroduction}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Add General Introduction
                </Button>
              </div>
            </div>
          )}
          
          <ThesisEditorContent
            frontMatter={thesis?.frontMatter || []}
            chapters={thesis?.chapters || []}
            backMatter={thesis?.backMatter || []}
            activeSection={activeSection}
            onContentChange={onContentChange}
            onTitleChange={onTitleChange}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
            hasGeneralIntroduction={hasGeneralIntroduction}
          />
        </div>
      </div>
      {showPreview && thesis && (
        <div className="w-1/2 pl-8 border-l">
          <ThesisEditorPreview thesis={thesis} previewRef={previewRef} />
        </div>
      )}
    </main>
  );
};
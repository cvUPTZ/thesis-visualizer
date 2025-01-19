import React from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const MIN_CHARS_FOR_CHAPTERS = 500; // Minimum characters required to enable chapter creation

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
  const [showIntroEditor, setShowIntroEditor] = React.useState(true);
  
  // Find or create general introduction section
  const introSection = thesis?.frontMatter.find(section => section.type === 'introduction') || {
    id: Date.now().toString(),
    title: "General Introduction",
    content: "",
    type: "introduction",
    order: thesis?.frontMatter.length || 0,
    required: true,
    figures: [],
    tables: [],
    citations: [],
    references: []
  };

  const handleIntroContentChange = (content: string) => {
    if (!thesis) return;
    onContentChange(introSection.id, content);
  };

  // Check if introduction content is long enough to enable chapter creation
  const hasEnoughContent = (introSection.content?.length || 0) >= MIN_CHARS_FOR_CHAPTERS;
  
  // Calculate remaining characters needed
  const remainingChars = Math.max(0, MIN_CHARS_FOR_CHAPTERS - (introSection.content?.length || 0));

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Collapsible
            open={showIntroEditor}
            onOpenChange={setShowIntroEditor}
            className="w-full bg-background rounded-lg shadow-sm"
          >
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">General Introduction</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {showIntroEditor ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="p-4">
              <div className="space-y-4">
                <MarkdownEditor
                  value={introSection.content}
                  onChange={(value) => handleIntroContentChange(value || '')}
                  placeholder="Start writing your general introduction..."
                />
                
                {!hasEnoughContent && (
                  <p className="text-sm text-muted-foreground">
                    Write {remainingChars} more characters to enable chapter creation
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {hasEnoughContent && (
            <ThesisEditorContent
              frontMatter={thesis?.frontMatter || []}
              chapters={thesis?.chapters || []}
              backMatter={thesis?.backMatter || []}
              activeSection={activeSection}
              onContentChange={onContentChange}
              onTitleChange={onTitleChange}
              onUpdateChapter={onUpdateChapter}
              onAddChapter={onAddChapter}
              hasGeneralIntroduction={hasEnoughContent}
            />
          )}
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
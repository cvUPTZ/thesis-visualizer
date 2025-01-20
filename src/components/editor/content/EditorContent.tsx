import React from 'react';
import EditorSection from '@/components/thesis/section/EditorSection';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GeneralIntroductionManager } from '@/components/thesis/managers/GeneralIntroductionManager';
import { AbstractManager } from '@/components/thesis/managers/AbstractManager';
import { AcknowledgementsManager } from '@/components/thesis/managers/AcknowledgementsManager';
import { GeneralConclusionManager } from '@/components/thesis/managers/GeneralConclusionManager';
import { ThesisStructureManager } from '@/components/thesis/managers/ThesisStructureManager';

interface EditorContentProps {
  title: string;
  content: string;
  required?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  type?: string;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  title,
  content,
  required,
  onTitleChange,
  onContentChange,
  type
}) => {
  console.log('EditorContent rendering:', { title, type });

  const renderSectionManager = () => {
    const section = {
      id: crypto.randomUUID(),
      title,
      content,
      type: type || 'custom',
      required: required || false
    };

    const handleUpdate = (updatedSection: any) => {
      onContentChange(updatedSection.content);
      if (updatedSection.title !== title) {
        onTitleChange(updatedSection.title);
      }
    };

    switch (type) {
      case 'introduction':
        return <GeneralIntroductionManager section={section} onUpdate={handleUpdate} />;
      case 'abstract':
        return <AbstractManager section={section} onUpdate={handleUpdate} />;
      case 'acknowledgments':
        return <AcknowledgementsManager section={section} onUpdate={handleUpdate} />;
      case 'conclusion':
        return <GeneralConclusionManager section={section} onUpdate={handleUpdate} />;
      case 'structure':
        return <ThesisStructureManager section={section} onUpdate={handleUpdate} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 text-editor-text"
                placeholder="Section Title"
              />
              {required && (
                <Badge variant="secondary" className="bg-editor-accent/10 text-editor-accent">
                  Required
                </Badge>
              )}
            </div>
            
            <MarkdownEditor
              value={content}
              onChange={(value) => onContentChange(value || '')}
              placeholder="Start writing..."
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderSectionManager()}
    </div>
  );
};
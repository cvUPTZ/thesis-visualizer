import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Thesis } from '@/types/thesis';
import { ThesisPreview } from '@/components/ThesisPreview';

interface ThesisEditorHeaderProps {
  thesis: Thesis | null;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisEditorHeader: React.FC<ThesisEditorHeaderProps> = ({
  thesis,
  onTogglePreview,
}) => {
  const handlePreviewClick = () => {
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${thesis?.title || 'Thesis Preview'}</title>
            <link rel="stylesheet" href="/src/styles/thesis.css">
            <style>
              body { margin: 0; padding: 20px; background: #f5f5f5; }
              .preview-container { max-width: 210mm; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div id="preview-root"></div>
          </body>
        </html>
      `);
      
      // Render the ThesisPreview component in the new window
      const PreviewComponent = React.createElement('div', { 
        className: 'preview-container'
      }, React.createElement(ThesisPreview, { thesis }));
      
      ReactDOM.render(PreviewComponent, previewWindow.document.getElementById('preview-root'));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handlePreviewClick}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface EditorLayoutProps {
  sidebar?: React.ReactNode;
  content?: React.ReactNode;
  preview?: React.ReactNode;
  showPreview?: boolean;
}

export const EditorLayout = ({ sidebar, content, preview, showPreview = false }: EditorLayoutProps) => {
  console.log('EditorLayout render:', { showPreview, hasPreview: !!preview });
  
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden animate-fade-in">
      <ResizablePanelGroup direction="horizontal">
        {sidebar && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              {sidebar}
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        
        <ResizablePanel 
          defaultSize={showPreview ? 50 : 80} 
          minSize={30}
        >
          <ScrollArea className="h-screen">
            <div className="p-6">
              {content}
            </div>
          </ScrollArea>
        </ResizablePanel>

        {showPreview && preview && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <ScrollArea className="h-screen">
                <div className="p-6">
                  {preview}
                </div>
              </ScrollArea>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
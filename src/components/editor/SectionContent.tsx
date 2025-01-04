import React, { memo, useCallback } from 'react';
import { MarkdownEditor } from '../MarkdownEditor';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionContentProps {
  content: string;
  onContentChange: (content: string) => void;
  isLoading?: boolean;
}

export const SectionContent = memo(({ content, onContentChange, isLoading }: SectionContentProps) => {
  console.log('Rendering SectionContent:', { 
    contentLength: content?.length,
    isLoading 
  });
  
  const handleChange = useCallback((value: string | undefined) => {
    if (value === undefined) return;
    
    console.log('Content change detected:', { 
      newContentLength: value.length 
    });
    onContentChange(value);
  }, [onContentChange]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return (
    <div className="relative">
      <MarkdownEditor
        value={content}
        onChange={handleChange}
        placeholder="Start writing..."
      />
    </div>
  );
});

SectionContent.displayName = 'SectionContent';
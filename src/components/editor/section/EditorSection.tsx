import React from 'react';
import { cn } from '@/lib/utils';

interface EditorSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const EditorSection = ({ children, className }: EditorSectionProps) => {
  return (
    <div className={cn(
      "bg-editor-bg border border-editor-border rounded-lg p-6 mb-6",
      "shadow-lg transition-all duration-200 hover:shadow-xl",
      "backdrop-blur-sm backdrop-filter",
      className
    )}>
      {children}
    </div>
  );
};
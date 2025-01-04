import React from 'react';
import { cn } from '@/lib/utils';

interface ThesisPreviewElementProps {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position?: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  onClick: (id: string, type: 'figure' | 'table' | 'citation') => void;
  children: React.ReactNode;
}

export const ThesisPreviewElement = ({
  id,
  type,
  position = 'inline',
  customPosition,
  size,
  onClick,
  children
}: ThesisPreviewElementProps) => {
  return (
    <div
      className={cn(
        "interactive-element",
        position === 'custom' && "absolute",
        "transition-all duration-200"
      )}
      style={{
        ...(position === 'custom' && customPosition
          ? {
              top: customPosition.y,
              left: customPosition.x,
            }
          : {}),
        ...(size
          ? {
              width: size.width,
              height: size.height,
            }
          : {})
      }}
      onClick={() => onClick(id, type)}
    >
      {children}
    </div>
  );
};
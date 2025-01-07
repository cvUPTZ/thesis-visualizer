import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ThesisPreviewElementProps {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position?: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  onClick: (id: string, type: 'figure' | 'table' | 'citation') => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
}

export const ThesisPreviewElement = ({
  id,
  type,
  position = 'inline',
  customPosition,
  size,
  onClick,
  onPositionChange,
  children
}: ThesisPreviewElementProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDragStart = (e: React.MouseEvent) => {
    if (position !== 'custom') return;
    
    setIsDragging(true);
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging) return;
        
        const newX = moveEvent.clientX - offsetX;
        const newY = moveEvent.clientY - offsetY;
        
        if (onPositionChange) {
          onPositionChange({ x: newX, y: newY });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        toast({
          title: "Position Updated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} position updated`,
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "interactive-element",
        position === 'custom' && "absolute cursor-move",
        isDragging && "opacity-70",
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
      onMouseDown={handleDragStart}
    >
      {children}
    </div>
  );
};
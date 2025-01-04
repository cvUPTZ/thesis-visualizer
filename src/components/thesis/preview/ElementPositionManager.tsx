import React, { useState } from 'react';
import { Figure, Table, Citation } from '@/types/thesis';
import { ElementControls } from './ElementControls';

interface ElementPosition {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

interface ElementPositionManagerProps {
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  onUpdatePosition: (elementId: string, position: ElementPosition) => void;
}

export const ElementPositionManager = ({
  figures,
  tables,
  citations,
  onUpdatePosition
}: ElementPositionManagerProps) => {
  const [selectedElement, setSelectedElement] = useState<ElementPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleElementClick = (element: { id: string, type: ElementPosition['type'] }) => {
    console.log('Element clicked:', element);
    setSelectedElement({
      id: element.id,
      type: element.type,
      position: 'inline',
      customPosition: { x: 0, y: 0 }
    });
  };

  const handlePositionChange = (position: ElementPosition['position']) => {
    if (!selectedElement) return;
    console.log('Position changed:', position);
    
    onUpdatePosition(selectedElement.id, {
      ...selectedElement,
      position
    });
  };

  const handleCoordinatesChange = (x: number, y: number) => {
    if (!selectedElement) return;
    console.log('Coordinates changed:', { x, y });
    
    onUpdatePosition(selectedElement.id, {
      ...selectedElement,
      position: 'custom',
      customPosition: { x, y }
    });
  };

  const handleSizeChange = (width: number, height: number) => {
    if (!selectedElement) return;
    console.log('Size changed:', { width, height });
    
    onUpdatePosition(selectedElement.id, {
      ...selectedElement,
      size: { width, height }
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      {selectedElement && (
        <ElementControls
          elementId={selectedElement.id}
          type={selectedElement.type}
          position={selectedElement.position}
          x={selectedElement.customPosition?.x}
          y={selectedElement.customPosition?.y}
          width={selectedElement.size?.width}
          height={selectedElement.size?.height}
          onUpdatePosition={handlePositionChange}
          onUpdateCoordinates={handleCoordinatesChange}
          onUpdateSize={handleSizeChange}
          onClose={() => setSelectedElement(null)}
        />
      )}

      <style jsx global>{`
        .interactive-element {
          cursor: ${isDragging ? 'grabbing' : 'grab'};
          transition: outline 0.2s ease;
          user-select: none;
        }
        .interactive-element:hover {
          outline: 2px solid #3b82f6;
        }
        .interactive-element.selected {
          outline: 2px solid #2563eb;
        }
      `}</style>
    </div>
  );
};
import React from 'react';
import { Figure, Table, Citation } from '@/types/thesis';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Move } from 'lucide-react';

interface ElementPosition {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: {
    x: number;
    y: number;
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
  const [selectedElement, setSelectedElement] = React.useState<ElementPosition | null>(null);

  const handlePositionChange = (position: ElementPosition['position']) => {
    if (!selectedElement) return;
    
    onUpdatePosition(selectedElement.id, {
      ...selectedElement,
      position
    });
  };

  const handleCustomPositionChange = (x: number, y: number) => {
    if (!selectedElement) return;
    
    onUpdatePosition(selectedElement.id, {
      ...selectedElement,
      position: 'custom',
      customPosition: { x, y }
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>Select Element</Label>
          <Select onValueChange={(value) => {
            if (value === 'placeholder') return;
            const [type, id] = value.split('-');
            setSelectedElement({
              id,
              type: type as ElementPosition['type'],
              position: 'inline'
            });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an element to position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Choose an element</SelectItem>
              {figures.map((figure) => (
                <SelectItem key={figure.id} value={`figure-${figure.id}`}>
                  Figure {figure.number}
                </SelectItem>
              ))}
              {tables.map((table) => (
                <SelectItem key={table.id} value={`table-${table.id}`}>
                  Table {table.id}
                </SelectItem>
              ))}
              {citations.map((citation) => (
                <SelectItem key={citation.id} value={`citation-${citation.id}`}>
                  Citation: {citation.text.substring(0, 30)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedElement && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Position Type</Label>
              <Select 
                value={selectedElement.position}
                onValueChange={handlePositionChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inline">Inline with Text</SelectItem>
                  <SelectItem value="top">Top of Page</SelectItem>
                  <SelectItem value="bottom">Bottom of Page</SelectItem>
                  <SelectItem value="custom">Custom Position</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedElement.position === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X Position (px)</Label>
                  <Input 
                    type="number"
                    value={selectedElement.customPosition?.x || 0}
                    onChange={(e) => handleCustomPositionChange(
                      Number(e.target.value),
                      selectedElement.customPosition?.y || 0
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position (px)</Label>
                  <Input 
                    type="number"
                    value={selectedElement.customPosition?.y || 0}
                    onChange={(e) => handleCustomPositionChange(
                      selectedElement.customPosition?.x || 0,
                      Number(e.target.value)
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePositionChange('top')}
              >
                <ArrowUp className="w-4 h-4 mr-1" />
                Move to Top
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePositionChange('bottom')}
              >
                <ArrowDown className="w-4 h-4 mr-1" />
                Move to Bottom
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePositionChange('custom')}
              >
                <Move className="w-4 h-4 mr-1" />
                Custom Position
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
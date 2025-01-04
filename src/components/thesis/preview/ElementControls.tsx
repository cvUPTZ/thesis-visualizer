import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, Move, Maximize2, Minimize2 } from 'lucide-react';

interface ElementControlsProps {
  elementId: string;
  type: 'figure' | 'table' | 'citation';
  position: 'inline' | 'top' | 'bottom' | 'custom';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  onUpdatePosition: (position: string) => void;
  onUpdateCoordinates: (x: number, y: number) => void;
  onUpdateSize: (width: number, height: number) => void;
  onClose: () => void;
}

export const ElementControls = ({
  elementId,
  type,
  position,
  x = 0,
  y = 0,
  width,
  height,
  onUpdatePosition,
  onUpdateCoordinates,
  onUpdateSize,
  onClose
}: ElementControlsProps) => {
  return (
    <Card className="fixed z-50 p-4 space-y-4 shadow-lg w-64 bg-background/95 backdrop-blur">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)} Controls
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={position} onValueChange={onUpdatePosition}>
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

        {position === 'custom' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>X Position</Label>
                <Input
                  type="number"
                  value={x}
                  onChange={(e) => onUpdateCoordinates(Number(e.target.value), y)}
                />
              </div>
              <div className="space-y-1">
                <Label>Y Position</Label>
                <Input
                  type="number"
                  value={y}
                  onChange={(e) => onUpdateCoordinates(x, Number(e.target.value))}
                />
              </div>
            </div>

            {(type === 'figure' || type === 'table') && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => onUpdateSize(Number(e.target.value), height || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Height</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => onUpdateSize(width || 0, Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdatePosition('top')}
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            Top
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdatePosition('bottom')}
          >
            <ArrowDown className="w-4 h-4 mr-1" />
            Bottom
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdatePosition('custom')}
          >
            <Move className="w-4 h-4 mr-1" />
            Move
          </Button>
        </div>
      </div>
    </Card>
  );
};
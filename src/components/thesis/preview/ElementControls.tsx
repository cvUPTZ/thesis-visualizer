import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, Move, Maximize2, Minimize2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
  const { toast } = useToast();
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [marginTop, setMarginTop] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);

  const handlePositionChange = (newPosition: string) => {
    console.log('Updating element position:', { elementId, newPosition });
    onUpdatePosition(newPosition);
    
    toast({
      title: "Position Updated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} position updated successfully`,
    });
  };

  const handleCoordinateChange = (newX: number, newY: number) => {
    console.log('Updating element coordinates:', { elementId, x: newX, y: newY });
    onUpdateCoordinates(newX, newY);
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setAlignment(newAlignment);
    let newX = x;
    if (newAlignment === 'center') newX = window.innerWidth / 2 - (width || 0) / 2;
    if (newAlignment === 'right') newX = window.innerWidth - (width || 0) - 20;
    handleCoordinateChange(newX, y);
  };

  const handleMarginChange = (top: number, bottom: number) => {
    setMarginTop(top);
    setMarginBottom(bottom);
    handleCoordinateChange(x, y + top);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="fixed z-50 p-4 space-y-4 shadow-lg w-80 bg-background/95 backdrop-blur">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)} Controls
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Position Type</Label>
            <Select value={position} onValueChange={handlePositionChange}>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-2">
                  <Button
                    variant={alignment === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAlignmentChange('left')}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={alignment === 'center' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAlignmentChange('center')}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={alignment === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAlignmentChange('right')}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Margins</Label>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs">Top Margin (px)</Label>
                    <Slider
                      value={[marginTop]}
                      onValueChange={([value]) => handleMarginChange(value, marginBottom)}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Bottom Margin (px)</Label>
                    <Slider
                      value={[marginBottom]}
                      onValueChange={([value]) => handleMarginChange(marginTop, value)}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>X Position (px)</Label>
                  <Input
                    type="number"
                    value={x}
                    onChange={(e) => handleCoordinateChange(Number(e.target.value), y)}
                    min={0}
                    step={1}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Y Position (px)</Label>
                  <Input
                    type="number"
                    value={y}
                    onChange={(e) => handleCoordinateChange(x, Number(e.target.value))}
                    min={0}
                    step={1}
                  />
                </div>
              </div>

              {(type === 'figure' || type === 'table') && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Width (px)</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => onUpdateSize(Number(e.target.value), height || 0)}
                      min={0}
                      step={1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => onUpdateSize(width || 0, Number(e.target.value))}
                      min={0}
                      step={1}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePositionChange('inline')}
                  className="gap-1"
                >
                  <Move className="w-4 h-4" />
                  Reset Position
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-3 border-b bg-primary/5 rounded-t-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Chat</h3>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
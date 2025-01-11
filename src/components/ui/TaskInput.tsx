import React from 'react';
import { Input } from './input';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from './button';

interface TaskInputProps {
  id: string;
  description: string;
  status: 'pending' | 'in progress' | 'completed' | 'on hold';
  onChangeDescription: (newDescription: string) => void;
  onToggleStatus: (newStatus: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const TaskItem: React.FC<TaskInputProps> = ({
  id,
  description,
  status,
  onChangeDescription,
    onToggleStatus,
  dueDate,
    priority
}) => {

  const handleToggleStatus = () => {
    if(status === 'pending') return onToggleStatus('in progress')
    if(status === 'in progress') return onToggleStatus('completed')
    if(status === 'completed') return onToggleStatus('on hold')
     if(status === 'on hold') return onToggleStatus('pending')
  }

    const getStatusIcon = () => {
        switch(status){
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Circle className="h-4 w-4 text-muted-foreground" />;
        }
    }

  return (
    <div className="flex items-center gap-2 p-2 rounded-md group hover:bg-accent/10">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleStatus}
        className="h-8 w-8 p-0"
      >
        {getStatusIcon()}
      </Button>
      <Input
        value={description}
        onChange={(e) => onChangeDescription(e.target.value)}
        className="bg-transparent border-none flex-1 focus-visible:ring-0"
        placeholder="Add a new task"
      />
    </div>
  );
};
import React, { useState } from 'react';
import { TaskItem } from '@/components/ui/TaskInput';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaskListProps {
  tasks: {
    id: string;
    description: string;
    status: 'pending' | 'in progress' | 'completed' | 'on hold';
    dueDate?: string;
      priority?: 'high' | 'medium' | 'low';
    }[];
   onUpdateTask: (taskId: string, newStatus: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
    onAddTask: () => void;
    onChangeTaskDescription: (taskId: string, newDescription: string) => void
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
    onUpdateTask,
    onAddTask,
    onChangeTaskDescription,
}) => {
  const [isOpen, setIsOpen] = useState(false);

    const handleToggleOpen = () => {
      setIsOpen(!isOpen)
    }
    
  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={handleToggleOpen} className="mt-4">
        <CollapsibleTrigger className="flex w-full justify-between hover:bg-editor-hover rounded-md py-2 px-3 items-center text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="">
              Tasks ({tasks.length})
            </span>
          </div>
           {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="w-4 h-4" /> }
        </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pl-2 space-y-2">
                {tasks.map((task) => (
                    <TaskItem 
                      key={task.id}
                      id={task.id}
                      description={task.description}
                      status={task.status}
                      onToggleStatus={(newStatus) => onUpdateTask(task.id, newStatus)}
                      onChangeDescription={(newDescription)=> onChangeTaskDescription(task.id, newDescription)}
                     />
                ))}
                  <Button
                     onClick={onAddTask}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2"
                  >
                    <PlusCircle className="h-4 w-4"/>
                    Add Task
                  </Button>
            </div>
          </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
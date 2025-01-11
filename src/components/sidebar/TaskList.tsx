import React from 'react';
import { Task } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, status: Task['status']) => void;
  onAddTask: () => void;
  onChangeTaskDescription: (taskId: string, newDescription: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onAddTask,
  onChangeTaskDescription,
}) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onUpdateTask(task.id, e.target.value as Task['status'])}
            className="text-sm rounded-md border border-input bg-transparent px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>
          <input
            type="text"
            value={task.description}
            onChange={(e) => onChangeTaskDescription(task.id, e.target.value)}
            className="flex-1 text-sm rounded-md border border-input bg-transparent px-2 py-1"
          />
        </div>
      ))}
      <Button
        onClick={onAddTask}
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
};
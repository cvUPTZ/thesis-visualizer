import React from 'react';
import { Section } from '@/types/thesis';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { TaskItem } from '@/components/ui/TaskInput';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SectionContentProps {
  section: Section;
  isActive: boolean;
  onContentChange: (content: string) => void;
  onUpdateSectionData: (section: Section) => void;
}

export const SectionContent: React.FC<SectionContentProps> = ({
  section,
  isActive,
  onContentChange,
  onUpdateSectionData
}) => {
  const [showTasks, setShowTasks] = React.useState(false);

  if (!isActive) return null;

  const handleAddSectionTask = () => {
    const newTask = {
      id: uuidv4(),
      description: 'New Task',
      status: 'pending' as const,
      priority: 'medium' as const
    };
    onUpdateSectionData({ 
      ...section, 
      tasks: [...(section.tasks || []), newTask] 
    });
  };

  const handleUpdateTaskStatus = (id: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => {
    const updatedTasks = (section.tasks || []).map(task =>
      task.id === id ? { ...task, status } : task
    );
    onUpdateSectionData({ ...section, tasks: updatedTasks });
  };

  const handleTaskDescription = (id: string, newDescription: string) => {
    const updatedTasks = (section.tasks || []).map(task =>
      task.id === id ? { ...task, description: newDescription } : task
    );
    onUpdateSectionData({ ...section, tasks: updatedTasks });
  };

  return (
    <div className="editor-content">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button size="sm" onClick={() => setShowTasks(!showTasks)} variant="outline">
          {showTasks ? 'Hide tasks' : 'Show Tasks'}
        </Button>
      </div>
      {showTasks && (
        <div className="space-y-2 mb-4">
          {(section.tasks || []).map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              description={task.description}
              status={task.status}
              priority={task.priority}
              onToggleStatus={(status) => handleUpdateTaskStatus(task.id, status)}
              onChangeDescription={(newDescription) => handleTaskDescription(task.id, newDescription)}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSectionTask}
            className="gap-2 bg-transparent"
          >
            <PlusCircle className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      )}
      <MarkdownEditor
        key={section.id}
        value={section.content}
        onChange={onContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};
import React, { useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useDebouncedCallback } from 'use-debounce';
import type { 
  Section, 
  Figure, 
  Table, 
  Citation, 
  ThesisSectionType,
  Task,
  CommentThread
} from '@/types/thesis';

// Interface for tasks panel props
interface TasksPanelProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

// Interface for comments panel props
interface CommentsPanelProps {
  comments: CommentThread[];
  onAddComment: (comment: Omit<CommentThread, 'id' | 'replies'>) => void;
  onReplyToComment: (commentId: string, reply: Omit<CommentThread, 'id' | 'replies'>) => void;
  onDeleteComment: (commentId: string) => void;
}

interface SectionEditorProps {
  section: Section;
  onTitleChange: (id: string, title: string) => void;
  onContentChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: ThesisSectionType) => void;
  onInsertFigure: (sectionId: string, figure: Omit<Figure, 'id' | 'number'>) => void;
  onInsertTable: (sectionId: string, table: Omit<Table, 'id' | 'number'>) => void;
  onInsertCitation: (sectionId: string, citation: Omit<Citation, 'id' | 'thesis_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask?: (sectionId: string, taskId: string, updates: Partial<Task>) => void;
  onAddTask?: (sectionId: string, task: Omit<Task, 'id'>) => void;
  onDeleteTask?: (sectionId: string, taskId: string) => void;
  onAddComment?: (sectionId: string, comment: Omit<CommentThread, 'id' | 'replies'>) => void;
  onReplyToComment?: (sectionId: string, commentId: string, reply: Omit<CommentThread, 'id' | 'replies'>) => void;
  onDeleteComment?: (sectionId: string, commentId: string) => void;
  disabled?: boolean;
  className?: string;
  showComments?: boolean;
  showTasks?: boolean;
}

const SECTION_TYPE_OPTIONS: Array<{ value: ThesisSectionType; label: string }> = [
  { value: 'title', label: 'Title' },
  { value: 'preface', label: 'Preface' },
  { value: 'acknowledgments', label: 'Acknowledgments' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'table-of-contents', label: 'Table of Contents' },
  { value: 'list-of-figures', label: 'List of Figures' },
  { value: 'list-of-tables', label: 'List of Tables' },
  { value: 'abbreviations', label: 'Abbreviations' },
  { value: 'glossary', label: 'Glossary' },
  { value: 'introduction', label: 'Introduction' },
  { value: 'theoretical-framework', label: 'Theoretical Framework' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'empirical-study', label: 'Empirical Study' },
  { value: 'results', label: 'Results' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'conclusion', label: 'Conclusion' },
  { value: 'recommendations', label: 'Recommendations' },
  { value: 'postface', label: 'Postface' },
  { value: 'references', label: 'References' },
  { value: 'appendix', label: 'Appendix' },
  { value: 'advice', label: 'Advice' },
  { value: 'custom', label: 'Custom' }
];

const SECTION_PLACEHOLDERS: Record<ThesisSectionType, string> = {
  'title': 'Enter the title of your thesis...',
  'preface': 'Write a preface to introduce your work...',
  'acknowledgments': 'Acknowledge those who helped with your research...',
  'abstract': 'Summarize your research in a concise manner...',
  'table-of-contents': 'Your table of contents will be generated automatically...',
  'list-of-figures': 'Your list of figures will be generated automatically...',
  'list-of-tables': 'Your list of tables will be generated automatically...',
  'abbreviations': 'List and explain the abbreviations used in your thesis...',
  'glossary': 'Define key terms and concepts used in your thesis...',
  'introduction': 'Introduce your research topic, objectives, and structure...',
  'theoretical-framework': 'Present the theoretical foundation of your research...',
  'methodology': 'Describe your research methods and approach...',
  'empirical-study': 'Present your empirical research design and execution...',
  'results': 'Present your research findings...',
  'discussion': 'Analyze and interpret your results...',
  'conclusion': 'Summarize your key findings and contributions...',
  'recommendations': 'Provide recommendations based on your findings...',
  'postface': 'Add any closing remarks or reflections...',
  'references': 'List your references in the required format...',
  'appendix': 'Include supplementary materials...',
  'advice': 'Provide guidance or recommendations...',
  'custom': 'Start writing your content...'
};

const TasksPanel: React.FC<TasksPanelProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const taskStatusOptions = ['pending', 'in progress', 'completed', 'on hold'];
  const priorityOptions = ['low', 'medium', 'high'];

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div className="flex justify-between items-center">
        <Label>Tasks</Label>
        <button
          onClick={() => onAddTask({ description: '', status: 'pending', priority: 'medium' })}
          className="text-sm px-2 py-1 bg-primary/10 rounded-md hover:bg-primary/20"
        >
          Add Task
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <Input
              value={task.description}
              onChange={(e) => onUpdateTask(task.id, { description: e.target.value })}
              className="flex-1"
              placeholder="Task description"
            />
            <Select
              value={task.status}
              onValueChange={(value) => onUpdateTask(task.id, { status: value as Task['status'] })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={task.priority}
              onValueChange={(value) => onUpdateTask(task.id, { priority: value as Task['priority'] })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SectionEditor = React.memo(({
  section,
  onTitleChange,
  onContentChange,
  onTypeChange,
  onInsertFigure,
  onInsertTable,
  onInsertCitation,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onAddComment,
  onReplyToComment,
  onDeleteComment,
  disabled = false,
  className = '',
  showComments = false,
  showTasks = false
}: SectionEditorProps) => {
  const debouncedTitleChange = useDebouncedCallback(
    (id: string, value: string) => {
      onTitleChange(id, value);
    },
    300
  );

  const debouncedContentChange = useDebouncedCallback(
    (id: string, value: string) => {
      onContentChange(id, value);
    },
    300
  );

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedTitleChange(section.id, e.target.value);
  }, [section.id, debouncedTitleChange]);

  const handleContentChange = useCallback((value: string) => {
    debouncedContentChange(section.id, value);
  }, [section.id, debouncedContentChange]);

  const handleTypeChange = useCallback((value: ThesisSectionType) => {
    onTypeChange(section.id, value);
  }, [section.id, onTypeChange]);

  const handleInsertFigure = useCallback((figure: Omit<Figure, 'id' | 'number'>) => {
    onInsertFigure(section.id, figure);
  }, [section.id, onInsertFigure]);

  const handleInsertTable = useCallback((table: Omit<Table, 'id' | 'number'>) => {
    onInsertTable(section.id, table);
  }, [section.id, onInsertTable]);

  const handleInsertCitation = useCallback((citation: Omit<Citation, 'id' | 'thesis_id' | 'created_at' | 'updated_at'>) => {
    onInsertCitation(section.id, citation);
  }, [section.id, onInsertCitation]);

  const handleAddTask = useCallback((task: Omit<Task, 'id'>) => {
    onAddTask?.(section.id, task);
  }, [section.id, onAddTask]);

  const handleUpdateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    onUpdateTask?.(section.id, taskId, updates);
  }, [section.id, onUpdateTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    onDeleteTask?.(section.id, taskId);
  }, [section.id, onDeleteTask]);

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="section-title">Section Title</Label>
          <Input
            id="section-title"
            defaultValue={section.title}
            onChange={handleTitleChange}
            className="text-xl font-serif"
            placeholder="Enter section title"
            disabled={disabled}
          />
        </div>
        <div className="w-full sm:w-48 space-y-2">
          <Label htmlFor="section-type">Section Type</Label>
          <Select
            value={section.type}
            onValueChange={handleTypeChange}
            disabled={disabled || section.required}
          >
            <SelectTrigger id="section-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {SECTION_TYPE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <MarkdownEditor
        value={section.content}
        onChange={handleContentChange}
        placeholder={SECTION_PLACEHOLDERS[section.type]}
        onInsertFigure={handleInsertFigure}
        onInsertTable={handleInsertTable}
        onInsertCitation={handleInsertCitation}
        figures={section.figures}
        tables={section.tables}
        citations={section.citations}
      />
      
      {section.figures && section.figures.length > 0 && (
        <div className="mt-4">
          <Label>Figures in this section</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {section.figures.map(figure => (
              <div key={figure.id} className="text-xs bg-gray-100 p-2 rounded-md">
                Figure {figure.number}: {figure.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {section.tables && section.tables.length > 0 && (
        <div className="mt-4">
          <Label>Tables in this section</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {section.tables.map(table => (
              <div key={table.id} className="text-xs bg-gray-100 p-2 rounded-md">
                Table {table.number}: {table.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {section.citations && section.citations.length > 0 && (
        <div className="mt-4">
          <Label>Citations in this section</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {section.citations.map(citation => (
              <div key={citation.id} className="text-xs bg-gray-100 p-2 rounded-md">
                {citation.authors.join(', ')} ({citation.year})
              </div>
            ))}
          </div>
        </div>
      )}

      {showTasks && (
        <TasksPanel
          tasks={section.tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </Card>
  );
});

SectionEditor.displayName = 'SectionEditor';

// src/components/tasks/TaskStageColumn.tsx
import React from 'react';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Task, TaskStage } from './types';

interface TaskStageColumnProps {
  stage: TaskStage;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (stageId: string) => void;
}

const TaskStageColumn: React.FC<TaskStageColumnProps> = ({ stage, tasks, onTaskClick, onAddTask }) => {
  return (
    <div className="bg-slate-100 p-3 rounded-lg w-72 min-w-[288px] h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-semibold text-md text-slate-700">{stage.name}</h3>
        <span className="text-sm text-slate-500">{tasks.length}</span>
      </div>
      <div className="flex-grow space-y-2 overflow-y-auto min-h-[100px] p-1 -m-1"> {/* Added padding for scrollbar */}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-slate-400 pt-4">
            No tasks in this stage.
          </div>
        )}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 w-full justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-200"
        onClick={() => onAddTask(stage.id)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </div>
  );
};

export default TaskStageColumn;

// src/components/tasks/TaskCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from './types';
import { Badge } from '@/components/ui/badge'; // Not used in provided template, but available
import { CalendarDays } from 'lucide-react'; // Icon for due date

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const assigneeInitial = task.assignee?.full_name
    ? task.assignee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : (task.assignee?.email ? task.assignee.email.charAt(0).toUpperCase() : '?');

  return (
    <Card
      className="mb-2 cursor-pointer hover:shadow-lg transition-shadow duration-150 ease-in-out bg-white"
      onClick={onClick}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold leading-tight">{task.title}</CardTitle>
      </CardHeader>

      {(task.assignee || task.due_date) && (
        <CardContent className="p-3 pt-0">
          {task.due_date && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <CalendarDays className="h-3 w-3 mr-1.5" />
              <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </CardContent>
      )}

      {(task.assignee || task.description) && ( // Show footer if there is an assignee or description for potential quick actions/info
         <CardFooter className="p-3 pt-1 flex items-center justify-between">
            {/* Placeholder for other info like comment count or priority */}
            <div className="text-xs text-muted-foreground">
                {/* {task.description ? <Paperclip className="h-4 w-4" /> : ''} */}
            </div>
            {task.assignee && (
                <Avatar className="h-6 w-6">
                    {task.assignee.avatar_url && <AvatarImage src={task.assignee.avatar_url} alt={task.assignee.full_name || 'Assignee'} />}
                    <AvatarFallback className="text-xs">{assigneeInitial}</AvatarFallback>
                </Avatar>
            )}
         </CardFooter>
      )}
    </Card>
  );
};

export default TaskCard;

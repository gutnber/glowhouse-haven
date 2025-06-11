// src/components/tasks/TaskBoard.tsx
import React, { useState, useEffect } from 'react';
import TaskStageColumn from './TaskStageColumn';
import { Task, TaskStage, User, Process } from './types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client'; // Placeholder

interface TaskBoardProps {
  processId: string;
}

// Mock Data (replace with Supabase fetching)
const MOCK_PROCESSES_DATA: { [key: string]: Process } = {
  proc1: { id: 'proc1', name: 'Tenant Onboarding', property_id: 'prop1', team_id: 'team1', created_at: new Date().toISOString() },
  proc2: { id: 'proc2', name: 'Maintenance Requests', property_id: 'prop2', team_id: 'team2', created_at: new Date().toISOString() }
};

const MOCK_STAGES_DATA: TaskStage[] = [
  { id: 'stage1', process_id: 'proc1', name: 'To Do', order: 0, created_at: new Date().toISOString() },
  { id: 'stage2', process_id: 'proc1', name: 'In Progress', order: 1, created_at: new Date().toISOString() },
  { id: 'stage3', process_id: 'proc1', name: 'Review', order: 2, created_at: new Date().toISOString() },
  { id: 'stage4', process_id: 'proc1', name: 'Done', order: 3, created_at: new Date().toISOString() },
  { id: 'stage1-proc2', process_id: 'proc2', name: 'New Request', order: 0, created_at: new Date().toISOString() },
  { id: 'stage2-proc2', process_id: 'proc2', name: 'Assigned', order: 1, created_at: new Date().toISOString() },
  { id: 'stage3-proc2', process_id: 'proc2', name: 'Completed', order: 2, created_at: new Date().toISOString() },
];

const MOCK_USERS_DATA: { [key: string]: User } = {
  user1: { id: 'user1', full_name: 'Alice Wonderland', email: 'alice@example.com', avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg' },
  user2: { id: 'user2', full_name: 'Bob The Builder', email: 'bob@example.com', avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg' },
};

const MOCK_TASKS_DATA: Task[] = [
  { id: 'task1', process_id: 'proc1', stage_id: 'stage1', title: 'Setup initial project structure', description: 'Create necessary folders and config files.', assignee: MOCK_USERS_DATA.user1, due_date: new Date(Date.now() + 3 * 24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
  { id: 'task2', process_id: 'proc1', stage_id: 'stage1', title: 'Design database schema for tasks', description: 'Define tables for tasks, stages, assignees.', created_at: new Date().toISOString() },
  { id: 'task3', process_id: 'proc1', stage_id: 'stage2', title: 'Develop API endpoints for CRUD operations', description: 'Implement GET, POST, PUT, DELETE for tasks.', assignee: MOCK_USERS_DATA.user2, due_date: new Date(Date.now() + 7 * 24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
  { id: 'task4', process_id: 'proc1', stage_id: 'stage3', title: 'Review API documentation', description: 'Check for clarity and completeness.', assignee: MOCK_USERS_DATA.user1, created_at: new Date().toISOString() },
  { id: 'task5', process_id: 'proc2', stage_id: 'stage1-proc2', title: 'Fix leaking faucet in Apt 101', description: 'Tenant reported a leak under the kitchen sink.', assignee: MOCK_USERS_DATA.user2, due_date: new Date(Date.now() + 1 * 24*60*60*1000).toISOString(), created_at: new Date().toISOString() },
  { id: 'task6', process_id: 'proc2', stage_id: 'stage2-proc2', title: 'Replace AC filter in Unit 20B', description: 'Scheduled maintenance task.', assignee: MOCK_USERS_DATA.user2, created_at: new Date().toISOString()},
];

const TaskBoard: React.FC<TaskBoardProps> = ({ processId }) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [stages, setStages] = useState<TaskStage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // TODO: State for selected task for editing modal

  useEffect(() => {
    setIsLoading(true);
    // TODO: Fetch process details, stages, and tasks for the given processId from Supabase
    console.log(`Fetching data for process ID: ${processId}`);

    // Simulate API call
    setTimeout(() => {
      const currentProcess = MOCK_PROCESSES_DATA[processId] || null;
      setProcess(currentProcess);

      if (currentProcess) {
        const currentStages = MOCK_STAGES_DATA.filter(s => s.process_id === processId).sort((a, b) => a.order - b.order);
        setStages(currentStages);

        const currentTasks = MOCK_TASKS_DATA.filter(t => t.process_id === processId);
        setTasks(currentTasks);
      } else {
        setStages([]);
        setTasks([]);
      }
      setIsLoading(false);
    }, 500);

  }, [processId]);

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
    // TODO: Set selected task and show editing modal/form
    alert(`Task clicked: ${task.title}`);
  };

  const handleAddTask = (stageId: string) => {
    console.log('Add task to stage:', stageId);
    // TODO: Show form to add new task to this stage
    alert(`Add task to stage: ${stages.find(s=>s.id === stageId)?.name}`);
  };

  const handleAddNewStage = () => {
    console.log('Add new stage for process:', processId);
    // TODO: Show form to add new stage
    alert('Add new stage functionality not implemented yet.');
  };

  if (isLoading) return <div className="p-6 text-center">Loading task board...</div>;
  if (!process) return <div className="p-6 text-center text-red-500">Process with ID '{processId}' not found.</div>;

  return (
    <div className="p-4 md:p-6 space-y-4 h-full flex flex-col bg-slate-50">
        <h2 className="text-2xl font-semibold text-slate-800">Board: {process.name}</h2>
        <div className="flex space-x-4 overflow-x-auto flex-grow pb-3">
            {stages.map(stage => (
            <TaskStageColumn
                key={stage.id}
                stage={stage}
                tasks={tasks.filter(task => task.stage_id === stage.id)}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
            />
            ))}
            <div className="min-w-[288px] pt-1"> {/* Adjusted to align with column */}
                <Button variant="outline" className="w-full h-12 border-dashed border-slate-400 text-slate-600 hover:text-slate-800 hover:border-slate-500" onClick={handleAddNewStage}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Stage
                </Button>
            </div>
        </div>
        {/* TODO: Add TaskDetailModal component here */}
    </div>
  );
};

export default TaskBoard;

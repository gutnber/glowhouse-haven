// src/pages/ProcessTaskBoardPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import TaskBoard from '@/components/tasks/TaskBoard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard for better icon

const ProcessTaskBoardPage: React.FC = () => {
  const { processId } = useParams<{ processId: string }>();

  if (!processId) {
    // This case should ideally be handled by router with a "not found" page
    // or a redirect if processId is essential for the route.
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-xl font-bold mb-4">Error: Process ID Missing</h1>
        <p>A process ID is required to display the task board.</p>
        <Button asChild className="mt-4">
          <Link to="/admin/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Processes
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50"> {/* Added bg-slate-50 for consistency */}
      <header className="p-3 md:p-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
            {/* Potentially add breadcrumbs or process title here later */}
            <Button asChild variant="outline" size="sm">
            <Link to="/admin/tasks" className="flex items-center text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Processes
            </Link>
            </Button>
            {/* Placeholder for other actions like "Edit Process Details" */}
        </div>
      </header>
      <main className="flex-grow overflow-hidden"> {/* Ensure main content area can grow and manage overflow */}
        <TaskBoard processId={processId} />
      </main>
    </div>
  );
};

export default ProcessTaskBoardPage;

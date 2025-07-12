// src/pages/TaskManagementPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ProcessList from '@/components/tasks/ProcessList';
import ProcessForm from '@/components/tasks/ProcessForm';
import { Button } from '@/components/ui/button';
import { Process, Property, Team } from '@/components/tasks/types';
// import { supabase } from '@/integrations/supabase/client'; // Assuming Supabase client for actual calls
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added for navigation

// Mock data for initial state and testing UI - replace with Supabase calls
const MOCK_PROPERTIES: Property[] = [
  { id: 'prop1', name: 'Skyline Apartments' },
  { id: 'prop2', name: 'Oceanview Villas' },
];

const MOCK_TEAMS: Team[] = [
  { id: 'team1', name: 'Leasing Team Alpha' },
  { id: 'team2', name: 'Maintenance Squad Bravo' },
];

const MOCK_PROCESSES: Process[] = [
  { id: 'proc1', name: 'New Tenant Onboarding', property_id: 'prop1', team_id: 'team1', created_at: new Date(Date.now() - 100000000).toISOString() },
  { id: 'proc2', name: 'Lease Renewal Process', property_id: 'prop1', team_id: 'team1', created_at: new Date(Date.now() - 200000000).toISOString() },
  { id: 'proc3', name: 'Routine Maintenance Request', property_id: 'prop2', team_id: 'team2', created_at: new Date(Date.now() - 50000000).toISOString() },
  { id: 'proc4', name: 'Emergency Repair Protocol', property_id: null, team_id: 'team2', created_at: new Date(Date.now() - 300000000).toISOString() },
];


const TaskManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const [processes, setProcesses] = useState<Process[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    console.log('Fetching data from Supabase...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    setProcesses(MOCK_PROCESSES);
    setProperties(MOCK_PROPERTIES);
    setTeams(MOCK_TEAMS);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateNew = () => {
    setEditingProcess(null);
    setShowForm(true);
  };

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setShowForm(true);
  };

  const handleViewBoard = (processId: string) => {
    navigate(`/admin/tasks/${processId}/board`); // Navigate to the board page
    console.log('Navigating to board for process:', processId);
  };

  const handleDeleteProcess = async (processId: string) => {
    if (!window.confirm('Are you sure you want to delete this process? This action cannot be undone.')) {
      return;
    }
    setIsLoading(true);
    console.log('Deleting process:', processId);
    // Mock deletion
    setProcesses(prev => prev.filter(p => p.id !== processId));
    setIsLoading(false);
    alert('Process deleted (mock).');
    // TODO: Implement actual Supabase delete and error handling
  };

  const handleFormSubmit = async (data: Omit<Process, 'id' | 'created_at' | 'property' | 'team'>) => {
    setIsLoading(true);
    console.log('Form data submitted:', data);

    if (editingProcess) {
      console.log('Updating process:', editingProcess.id, data);
      // Mock update:
      setProcesses(prev => prev.map(p => p.id === editingProcess.id ? { ...p, ...data, id: editingProcess.id, created_at: editingProcess.created_at } : p ));
      alert('Process updated (mock).');
    } else {
      console.log('Creating new process with data:', data);
      // Mock create:
      const newProcess: Process = { ...data, id: `proc${Date.now()}`, created_at: new Date().toISOString() };
      setProcesses(prev => [...prev, newProcess]);
      alert('Process created (mock).');
    }
    // TODO: Implement actual Supabase insert/update and error handling

    setShowForm(false);
    setEditingProcess(null);
    setIsLoading(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProcess(null);
  };

  if (isLoading && !processes.length && !showForm) {
    return <div className="p-6 text-center">Loading process management tools...</div>;
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6 bg-background min-h-screen"> {/* Ensure page takes height */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Process Management</h1>
        {!showForm && (
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <PlusCircle size={20} />
            Create New Process
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg shadow-md"> {/* Added card styling for form container */}
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            {editingProcess ? 'Edit Process' : 'Create New Process'}
          </h2>
          <ProcessForm
            initialData={editingProcess}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            // properties={properties} // Pass actual fetched properties
            // teams={teams}           // Pass actual fetched teams
          />
        </div>
      ) : (
        isLoading && !processes.length ?
          <p className="text-center text-gray-500 py-8">Loading processes...</p> :
          <ProcessList
            processes={processes}
            properties={properties}
            teams={teams}
            onEditProcess={handleEditProcess}
            onViewBoard={handleViewBoard}
            onDeleteProcess={handleDeleteProcess}
          />
      )}
    </div>
  );
};

export default TaskManagementPage;

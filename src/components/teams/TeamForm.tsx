// src/components/teams/TeamForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Team } from './types';

interface TeamFormProps {
  initialData?: Team | null;
  onSubmit: (data: Pick<Team, 'name'>) => void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName(''); // Reset for new form
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        // Basic validation: can show an error message here
        alert("Team name cannot be empty.");
        return;
    }
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-semibold text-foreground">
        {initialData ? 'Edit Team' : 'Create New Team'}
      </h3>
      <div>
        <Label htmlFor="teamName" className="block text-sm font-medium text-muted-foreground">Team Name</Label>
        <Input
          id="teamName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1"
          placeholder="e.g., Marketing Department"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Team' : 'Create Team'}</Button>
      </div>
    </form>
  );
};
export default TeamForm;

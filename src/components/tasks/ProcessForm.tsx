// src/components/tasks/ProcessForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Process, Property, Team } from './types'; // Using the new types file

interface ProcessFormProps {
  initialData?: Process | null;
  onSubmit: (data: Omit<Process, 'id' | 'created_at' | 'property' | 'team'>) => void; // Exclude joined objects
  onCancel: () => void;
  // TODO: Pass properties and teams as props once fetched in parent
  // properties: Property[];
  // teams: Team[];
}

// Mock data for dropdowns - replace with actual data fetching in parent component
const mockProperties: Property[] = [
    { id: 'prop1', name: 'Property Alpha' },
    { id: 'prop2', name: 'Property Beta Towers' },
    { id: 'prop3', name: 'Property Gamma Complex' }
];
const mockTeams: Team[] = [
    { id: 'team1', name: 'Sales Team' },
    { id: 'team2', name: 'Maintenance Crew' },
    { id: 'team3', name: 'Support Staff' }
];


const ProcessForm: React.FC<ProcessFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  // properties = mockProperties, // Use props once available
  // teams = mockTeams             // Use props once available
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [propertyId, setPropertyId] = useState(initialData?.property_id || '');
  const [teamId, setTeamId] = useState(initialData?.team_id || '');

  // TODO: Consider if useEffect is needed here if properties/teams are passed as props
  // and might change, or if initialData changes. For now, parent will manage data fetching.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, property_id: propertyId || null, team_id: teamId || null });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm bg-card space-y-6">
      <div>
        <Label htmlFor="processName" className="block text-sm font-medium text-gray-700">Process Name</Label>
        <Input
          id="processName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full"
          placeholder="e.g., Tenant Onboarding"
        />
      </div>
      <div>
        <Label htmlFor="property" className="block text-sm font-medium text-gray-700">Property (Optional)</Label>
        <Select value={propertyId || ''} onValueChange={setPropertyId}>
          <SelectTrigger id="property" className="mt-1 block w-full">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {mockProperties.map(prop => ( // Replace mockProperties with props.properties
              <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
            ))}
            {/* TODO: Populate with actual properties passed via props */}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="team" className="block text-sm font-medium text-gray-700">Team (Optional)</Label>
        <Select value={teamId || ''} onValueChange={setTeamId}>
          <SelectTrigger id="team" className="mt-1 block w-full">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {mockTeams.map(team => ( // Replace mockTeams with props.teams
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
            {/* TODO: Populate with actual teams passed via props */}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Process' : 'Create Process'}</Button>
      </div>
    </form>
  );
};

export default ProcessForm;

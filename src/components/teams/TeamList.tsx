// src/components/teams/TeamList.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Team } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { Users, Edit3, Trash2 } from 'lucide-react'; // Icons

interface TeamListProps {
  teams: Team[];
  selectedTeamId?: string | null;
  onSelectTeam: (teamId: string) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, selectedTeamId, onSelectTeam, onEditTeam, onDeleteTeam }) => {
  if (teams.length === 0) {
    return (
      <Card className="text-center p-6">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <CardTitle className="text-lg font-semibold">No Teams Yet</CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Get started by creating a new team.
        </CardDescription>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <Card
          key={team.id}
          className={`cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md ${selectedTeamId === team.id ? 'border-primary ring-1 ring-primary shadow-lg' : 'border-border'}`}
          onClick={() => onSelectTeam(team.id)}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4 space-x-2">
            <div className="flex-grow overflow-hidden">
                <CardTitle className="text-md font-semibold truncate" title={team.name}>{team.name}</CardTitle>
                {team.created_at && (
                    <p className="text-xs text-muted-foreground">
                        Created: {new Date(team.created_at).toLocaleDateString()}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEditTeam(team);}}>
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit Team</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={(e) => { e.stopPropagation(); onDeleteTeam(team.id);}}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Team</span>
                </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
export default TeamList;

// src/components/tasks/ProcessList.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Process, Property, Team } from './types'; // Using the new types file
import { MoreHorizontal, PlayCircle, Edit2, Trash2 } from 'lucide-react'; // Icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ProcessListProps {
  processes: Process[]; // Expect processes to be passed as a prop
  properties: Property[]; // Expect properties to be passed
  teams: Team[]; // Expect teams to be passed
  onEditProcess: (process: Process) => void;
  onViewBoard: (processId: string) => void;
  onDeleteProcess: (processId: string) => void; // Added for completeness
}

const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  properties,
  teams,
  onEditProcess,
  onViewBoard,
  onDeleteProcess
}) => {

  // Helper function to get property name
  const getPropertyName = (propertyId: string | null) => {
    if (!propertyId) return 'N/A';
    return properties.find(p => p.id === propertyId)?.name || 'Unknown Property';
  };

  // Helper function to get team name
  const getTeamName = (teamId: string | null) => {
    if (!teamId) return 'N/A';
    return teams.find(t => t.id === teamId)?.name || 'Unknown Team';
  };

  if (!processes.length) {
    return <p className="text-center text-gray-500 py-8">No processes found. Get started by creating a new one!</p>;
  }

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-card">
      <Table>
        <TableCaption>A list of your configured processes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{process.name}</TableCell>
              <TableCell>{getPropertyName(process.property_id)}</TableCell>
              <TableCell>{getTeamName(process.team_id)}</TableCell>
              <TableCell>{process.created_at ? new Date(process.created_at).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewBoard(process.id)}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      View Board
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditProcess(process)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteProcess(process.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessList;

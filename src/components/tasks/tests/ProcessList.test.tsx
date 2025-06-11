// src/components/tasks/tests/ProcessList.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProcessList from '../ProcessList';
import { Process, Property, Team } from '../types';

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const mockProperties: Property[] = [
    { id: 'prop1', name: 'Property Alpha' },
    { id: 'prop2', name: 'Property Beta' }
];
const mockTeams: Team[] = [
    { id: 'team1', name: 'Sales Team' },
    { id: 'team2', name: 'Ops Team' }
];

const mockProcesses: Process[] = [
  { id: 'proc1', name: 'Tenant Onboarding', property_id: 'prop1', team_id: 'team1', created_at: new Date().toISOString() },
  { id: 'proc2', name: 'Maintenance Request', property_id: 'prop2', team_id: 'team2', created_at: new Date().toISOString() },
];
// ProcessList expects processes with resolved property/team names or it resolves them using props
// The component itself has getPropertyName and getTeamName, so we need to pass properties and teams lists.

describe('ProcessList', () => {
  const mockOnEditProcess = vi.fn();
  const mockOnViewBoard = vi.fn();
  const mockOnDeleteProcess = vi.fn();

  beforeEach(() => {
    mockOnEditProcess.mockClear();
    mockOnViewBoard.mockClear();
    mockOnDeleteProcess.mockClear();
  });

  it('renders a list of processes with their details', () => {
    render(
      <ProcessList
        processes={mockProcesses}
        properties={mockProperties}
        teams={mockTeams}
        onEditProcess={mockOnEditProcess}
        onViewBoard={mockOnViewBoard}
        onDeleteProcess={mockOnDeleteProcess}
      />
    );
    expect(screen.getByText('Tenant Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Property Alpha')).toBeInTheDocument(); // Check if property name is resolved
    expect(screen.getByText('Sales Team')).toBeInTheDocument();   // Check if team name is resolved

    expect(screen.getByText('Maintenance Request')).toBeInTheDocument();
    expect(screen.getByText('Property Beta')).toBeInTheDocument();
    expect(screen.getByText('Ops Team')).toBeInTheDocument();
  });

  it('calls onEditProcess when edit is clicked on a process', () => {
    render(
      <ProcessList
        processes={mockProcesses}
        properties={mockProperties}
        teams={mockTeams}
        onEditProcess={mockOnEditProcess}
        onViewBoard={mockOnViewBoard}
        onDeleteProcess={mockOnDeleteProcess}
      />
    );
    // DropdownMenu is used. First, find all dropdown triggers (MoreHorizontal icon button)
    const dropdownTriggers = screen.getAllByRole('button', { name: /open menu/i });
    fireEvent.click(dropdownTriggers[0]); // Click the first dropdown trigger

    // Then find the "Edit" menu item and click it
    // Note: getByRole might need adjustment based on actual rendered ARIA roles for DropdownMenuItem
    const editMenuItem = screen.getByRole('menuitem', { name: /edit/i });
    fireEvent.click(editMenuItem);

    expect(mockOnEditProcess).toHaveBeenCalledWith(mockProcesses[0]);
  });

  it('calls onViewBoard when View Board is clicked on a process', () => {
    render(
      <ProcessList
        processes={mockProcesses}
        properties={mockProperties}
        teams={mockTeams}
        onEditProcess={mockOnEditProcess}
        onViewBoard={mockOnViewBoard}
        onDeleteProcess={mockOnDeleteProcess}
      />
    );
    const dropdownTriggers = screen.getAllByRole('button', { name: /open menu/i });
    fireEvent.click(dropdownTriggers[0]);

    const viewBoardMenuItem = screen.getByRole('menuitem', { name: /view board/i });
    fireEvent.click(viewBoardMenuItem);

    expect(mockOnViewBoard).toHaveBeenCalledWith(mockProcesses[0].id);
  });

  it('calls onDeleteProcess when Delete is clicked on a process', () => {
    render(
      <ProcessList
        processes={mockProcesses}
        properties={mockProperties}
        teams={mockTeams}
        onEditProcess={mockOnEditProcess}
        onViewBoard={mockOnViewBoard}
        onDeleteProcess={mockOnDeleteProcess}
      />
    );
    const dropdownTriggers = screen.getAllByRole('button', { name: /open menu/i });
    fireEvent.click(dropdownTriggers[1]); // Click the second dropdown for "Maintenance Request"

    const deleteMenuItem = screen.getByRole('menuitem', { name: /delete/i });
    fireEvent.click(deleteMenuItem);

    expect(mockOnDeleteProcess).toHaveBeenCalledWith(mockProcesses[1].id);
  });

  it('renders empty state if no processes', () => {
    render(
      <ProcessList
        processes={[]}
        properties={mockProperties}
        teams={mockTeams}
        onEditProcess={mockOnEditProcess}
        onViewBoard={mockOnViewBoard}
        onDeleteProcess={mockOnDeleteProcess}
      />
    );
    // The component has a specific message for no processes
    expect(screen.getByText(/no processes found/i)).toBeInTheDocument();
  });
});

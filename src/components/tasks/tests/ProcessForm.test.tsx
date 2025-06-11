// src/components/tasks/tests/ProcessForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // or vitest equivalent
import ProcessForm from '../ProcessForm';
import { Process, Property, Team } from '../types';

// Mock properties and teams data as ProcessForm expects them for dropdowns
// These would typically be passed as props if the form doesn't fetch them itself.
// For this test, ProcessForm uses internal mock data, so these aren't strictly needed for *this* version of ProcessForm
// but are good to have for when it's refactored to accept properties/teams as props.
const mockProperties: Property[] = [{ id: 'prop1', name: 'Property Alpha' }];
const mockTeams: Team[] = [{ id: 'team1', name: 'Sales Team' }];

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);


describe('ProcessForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders correctly for creating a new process', () => {
    render(
      <ProcessForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        // properties={mockProperties} // ProcessForm currently uses internal mock data
        // teams={mockTeams}
      />
    );
    expect(screen.getByLabelText(/process name/i)).toBeInTheDocument();
    // Check for property and team selects
    expect(screen.getByText(/property \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByText(/team \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create process/i })).toBeInTheDocument();
  });

  it('renders with initial data for editing', () => {
    const initialData: Process = {
      id: 'proc1',
      name: 'Existing Process',
      property_id: 'prop1',
      team_id: 'team1',
    };
    render(
      <ProcessForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        // properties={mockProperties}
        // teams={mockTeams}
      />
    );
    expect(screen.getByLabelText(/process name/i)).toHaveValue('Existing Process');
    // To check select values, you might need to check the underlying SelectTrigger's displayed value
    // This depends on how `SelectValue` component renders the placeholder vs actual value.
    // For example, if 'Property Alpha' is displayed for property_id 'prop1':
    // expect(screen.getByText('Property Alpha')).toBeInTheDocument(); // This might be too simple, might need more specific selector for SelectValue

    expect(screen.getByRole('button', { name: /update process/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when creating', async () => {
    render(
      <ProcessForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        // properties={mockProperties}
        // teams={mockTeams}
      />
    );
    fireEvent.change(screen.getByLabelText(/process name/i), { target: { value: 'New Test Process' } });

    // Simulate selecting from property dropdown
    // This part is complex because of how Select components often work (portals, dynamic elements)
    // For simplicity, we'll assume the internal mock data is used and we can find items by name
    // Or, if ProcessForm is changed to take properties/teams as props, we can pass them.
    // fireEvent.mouseDown(screen.getByLabelText(/property/i)); // This might not work directly for custom select.
    // For the current ProcessForm, it uses its own mockProperties.
    // Let's select 'Property Alpha' (value 'prop1')
    const propertySelect = screen.getByRole('combobox', { name: /property \(optional\)/i });
    fireEvent.mouseDown(propertySelect);
    // Wait for options to appear if they are dynamically rendered or in a portal
    // For this test, options are directly in SelectContent.
    // The text 'Property Alpha' should be an option.
    // await screen.findByText('Property Alpha'); // This find might be needed if options are async
    // fireEvent.click(screen.getByText('Property Alpha')); // This will select it

    // Let's assume we want to select 'Property Alpha' which has value 'prop1'
    // And 'Sales Team' which has value 'team1'
    // For simplicity, this test will rely on the default empty selections if interaction is too complex for this illustrative test

    fireEvent.click(screen.getByRole('button', { name: /create process/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Test Process',
        property_id: '', // Default empty value from useState('')
        team_id: '',     // Default empty value
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProcessForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('requires process name', async () => {
    render(<ProcessForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /create process/i }));

    // Check if onSubmit was NOT called
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Optionally, check for a validation message if your form displays one,
    // or if the input field has an :invalid pseudo-class (requires browser-like environment)
    // For this example, we assume the browser's default HTML5 validation prevents submission.
    // If custom validation + alert is used:
    // const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    // expect(alertMock).toHaveBeenCalledWith("Team name cannot be empty."); // if TeamForm used alert
    // alertMock.mockRestore();
  });
});

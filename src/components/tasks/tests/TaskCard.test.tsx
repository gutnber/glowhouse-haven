// src/components/tasks/tests/TaskCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../TaskCard';
import { Task, User } from '../types';

const mockAssignee: User = {
  id: 'user1',
  full_name: 'John Doe',
  email: 'john@example.com',
  avatar_url: 'https://example.com/avatar.jpg'
};

const mockTaskWithoutOptionalFields: Task = {
  id: 'task0',
  process_id: 'proc0',
  stage_id: 'stage0',
  title: 'Task With Only Title',
};

const mockTaskWithAllFields: Task = {
  id: 'task1',
  process_id: 'proc1',
  stage_id: 'stage1',
  title: 'Complete Test Task Title',
  description: 'This is a test description.',
  assignee: mockAssignee,
  due_date: '2024-12-31T00:00:00.000Z', // Use a fixed date for consistent testing
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
};

describe('TaskCard', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders task title correctly', () => {
    render(<TaskCard task={mockTaskWithAllFields} onClick={mockOnClick} />);
    expect(screen.getByText('Complete Test Task Title')).toBeInTheDocument();
  });

  it('renders due date when provided', () => {
    render(<TaskCard task={mockTaskWithAllFields} onClick={mockOnClick} />);
    // Date formatting can be tricky due to localization.
    // Test for parts of the date or use a regex.
    // The component uses toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    // For '2024-12-31T00:00:00.000Z', this would be 'Dec 31' in en-US.
    expect(screen.getByText(/Dec 31/i)).toBeInTheDocument();
  });

  it('does not render due date when not provided', () => {
    render(<TaskCard task={mockTaskWithoutOptionalFields} onClick={mockOnClick} />);
    expect(screen.queryByText(/Due:/i)).not.toBeInTheDocument();
  });

  it('renders assignee avatar with initials when assignee is provided', () => {
    render(<TaskCard task={mockTaskWithAllFields} onClick={mockOnClick} />);
    // The initials logic is 'JD' for 'John Doe'
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders assignee avatar with email initial if full_name is missing', () => {
    const taskWithEmailOnlyAssignee: Task = {
        ...mockTaskWithoutOptionalFields,
        id: 'task-email-assignee',
        assignee: { id: 'user2', email: 'test@example.com' }
    };
    render(<TaskCard task={taskWithEmailOnlyAssignee} onClick={mockOnClick} />);
    expect(screen.getByText('T')).toBeInTheDocument(); // Initial of 'test@example.com'
  });

  it('does not render assignee avatar when assignee is not provided', () => {
    render(<TaskCard task={mockTaskWithoutOptionalFields} onClick={mockOnClick} />);
    // Check that Avatar component or its specific content (like initials) is not there.
    // This depends on how AvatarFallback is handled. If it always renders something, this test needs refinement.
    // For now, let's assume if no assignee, the footer with avatar is not rendered or is empty.
    // The component's logic is: {task.assignee && (<CardFooter>...<Avatar>...</Avatar></CardFooter>)}
    const cardFooters = screen.queryAllByRole('contentinfo'); // CardFooter has no specific role, so this is a guess.
                                                              // A data-testid would be better.
    let avatarFound = false;
    cardFooters.forEach(footer => {
        if (footer.querySelector('.lucide-user, .lucide-user-circle, .avatar-fallback-text')) { // Example selectors
            avatarFound = true;
        }
    });
    // This test is a bit weak. A more robust way would be to ensure the CardFooter related to assignee is absent.
    // Given the current structure, we expect the text 'JD' (or any initials) to NOT be present if no assignee.
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
    expect(screen.queryByText('T')).not.toBeInTheDocument();


  });

  it('calls onClick when card is clicked', () => {
    render(<TaskCard task={mockTaskWithAllFields} onClick={mockOnClick} />);
    // Click the card itself. The title is a good, stable element within the card to target.
    fireEvent.click(screen.getByText('Complete Test Task Title'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with minimal task data (only title)', () => {
    render(<TaskCard task={mockTaskWithoutOptionalFields} onClick={mockOnClick} />);
    expect(screen.getByText('Task With Only Title')).toBeInTheDocument();
    // Ensure optional elements are not rendered if data is missing
    expect(screen.queryByText(/Due:/i)).not.toBeInTheDocument();
    // Check that the footer section for assignee (which might contain an Avatar) is not present or empty
    // This depends on the exact rendering logic of CardFooter in TaskCard
    // If CardFooter is always rendered, check its children.
    // If CardFooter is conditional on assignee, then queryByRole('contentinfo') might return null or fewer elements.
  });
});

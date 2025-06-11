// src/components/tasks/types.ts
export interface Property {
  id: string; // or UUID
  name: string;
  // other property fields
}

export interface Team {
  id: string; // or UUID
  name: string;
  // other team fields
}

export interface Process {
  id: string; // or UUID
  name: string;
  property_id: string | null;
  team_id: string | null;
  created_at?: string; // Assuming TIMESTAMPTZ comes as string
  // Potentially include property and team objects if joining
  property?: Property; // Optional, if you fetch joined data
  team?: Team;       // Optional, if you fetch joined data
}

export interface User { // Simplified User type for assignee
  id: string; // or UUID
  full_name?: string; // Supabase often has this in user_metadata
  email?: string;
  avatar_url?: string; // Optional: if you store avatar URLs
}

export interface TaskStage {
  id: string; // or UUID
  process_id: string;
  name: string;
  order: number; // To determine column order
  created_at?: string;
}

export interface Task {
  id: string; // or UUID
  process_id: string;
  stage_id: string;
  title: string;
  description?: string | null;
  assigned_to?: string | null; // User ID
  assignee?: User | null; // Populated User object (e.g., from a join or separate query)
  due_date?: string | null; // ISO date string
  created_at?: string;
  updated_at?: string;
}

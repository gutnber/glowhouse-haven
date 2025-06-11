// src/components/teams/types.ts
import { User } from '@/components/tasks/types'; // Re-use simplified User type

export interface Team {
  id: string; // UUID
  name: string;
  created_at?: string;
}

export interface TeamMember {
  id: string; // UUID for the team_members table row itself
  team_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at?: string;
  user?: User; // For displaying user details like name/email, populated from a join or separate fetch
}

// Re-export User if needed for other modules, though direct import is usually fine.
// export { User };

// src/components/leads/types.ts
import { Property } from '@/components/tasks/types'; // Re-use from tasks types

export interface Lead {
  id: string; // or UUID
  property_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: 'csv_import' | 'manual_entry' | 'website_form' | string; // Allow string for other sources
  status?: string; // e.g., 'New', 'Contacted', 'Qualified', 'Lost'
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string; // User ID of creator
  property?: Property; // Optional: for displaying property name in lists, if fetched via join
}

// Re-export Property if needed, or ensure it's correctly imported where used.
// For components within this module, direct import from '@/components/tasks/types' is fine.
// export { Property };

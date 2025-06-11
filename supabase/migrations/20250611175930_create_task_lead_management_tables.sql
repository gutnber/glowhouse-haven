-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage teams
CREATE POLICY "Authenticated users can manage teams" ON teams
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (team_id, user_id)
);

-- Enable Row Level Security for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage team_members
CREATE POLICY "Authenticated users can manage team_members" ON team_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create processes table
CREATE TABLE processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL, -- Assuming properties table exists
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(), -- Set default for created_by
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for processes
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;

-- Create task_stages table
CREATE TABLE task_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (process_id, name),
    UNIQUE (process_id, "order")
);

-- Enable Row Level Security for task_stages
ALTER TABLE task_stages ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES task_stages(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL, -- Assuming properties table exists
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT CHECK (source IN ('csv_import', 'manual_entry', 'website_form')),
    status TEXT DEFAULT 'New',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    -- created_by and updated_by will be added via ALTER TABLE below
);

-- Enable Row Level Security for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage leads -- THIS WILL BE DROPPED AND REPLACED
CREATE POLICY "Authenticated users can manage leads" ON leads
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Helper Functions for RLS
CREATE OR REPLACE FUNCTION is_team_member(team_id_to_check UUID, user_id_to_check UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_id_to_check AND tm.user_id = user_id_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_team_admin(team_id_to_check UUID, user_id_to_check UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = team_id_to_check AND tm.user_id = user_id_to_check AND tm.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION is_team_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_team_admin(UUID, UUID) TO authenticated;

-- RLS Policies for processes
-- Remove old permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage processes" ON processes;

-- SELECT: Users can see processes if they created them or are part of the assigned team.
CREATE POLICY "Users can view processes they created or are team members of"
ON processes FOR SELECT TO authenticated
USING (
  auth.uid() = created_by OR
  is_team_member(team_id, auth.uid())
);

-- INSERT: Authenticated users can create processes. created_by is set by default.
CREATE POLICY "Authenticated users can create processes"
ON processes FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND -- Ensure created_by is the current user
  (team_id IS NULL OR is_team_member(team_id, auth.uid()))
);

-- UPDATE: Users can update processes if they created them or are team admins.
CREATE POLICY "Users can update processes they created or are team admins of"
ON processes FOR UPDATE TO authenticated
USING (
  auth.uid() = created_by OR
  is_team_admin(team_id, auth.uid())
)
WITH CHECK (
  (team_id IS NULL OR is_team_member(team_id, auth.uid())) AND
  (created_by = (SELECT p.created_by FROM processes p WHERE p.id = id)) -- Prevent changing created_by
);

-- DELETE: Users can delete processes if they created them or are team admins.
CREATE POLICY "Users can delete processes they created or are team admins of"
ON processes FOR DELETE TO authenticated
USING (
  auth.uid() = created_by OR
  is_team_admin(team_id, auth.uid())
);

-- Helper function to check process access (based on process's RLS for UPDATE)
CREATE OR REPLACE FUNCTION can_update_process(process_id_to_check UUID, user_id_to_check UUID)
RETURNS BOOLEAN AS $$
DECLARE
  process_created_by UUID;
  process_team_id UUID;
BEGIN
  SELECT p.created_by, p.team_id INTO process_created_by, process_team_id FROM processes p WHERE p.id = process_id_to_check;
  IF NOT FOUND THEN
    RETURN FALSE; -- Process does not exist
  END IF;
  RETURN (user_id_to_check = process_created_by OR (process_team_id IS NOT NULL AND is_team_admin(process_team_id, user_id_to_check)));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION can_update_process(UUID, UUID) TO authenticated;

-- RLS Policies for task_stages
-- Remove old permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage task_stages" ON task_stages;

-- SELECT: Users can see stages for processes they can view.
CREATE POLICY "Users can view task stages for accessible processes"
ON task_stages FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM processes p
    WHERE p.id = task_stages.process_id
    AND (p.created_by = auth.uid() OR (p.team_id IS NOT NULL AND is_team_member(p.team_id, auth.uid()))) -- check process SELECT RLS
  )
);

-- INSERT: Users can insert stages if they can update the parent process.
CREATE POLICY "Users can create task stages if they can update parent process"
ON task_stages FOR INSERT TO authenticated
WITH CHECK ( can_update_process(process_id, auth.uid()) );

-- UPDATE: Users can update stages if they can update the parent process.
CREATE POLICY "Users can update task stages if they can update parent process"
ON task_stages FOR UPDATE TO authenticated
USING ( can_update_process(process_id, auth.uid()) )
WITH CHECK ( can_update_process(process_id, auth.uid()) );

-- DELETE: Users can delete stages if they can update the parent process.
CREATE POLICY "Users can delete task stages if they can update parent process"
ON task_stages FOR DELETE TO authenticated
USING ( can_update_process(process_id, auth.uid()) );

-- RLS Policies for tasks
-- Remove old permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON tasks;

-- SELECT: Users can see tasks for processes they can view, or if assigned to them.
CREATE POLICY "Users can view tasks for accessible processes or if assigned"
ON tasks FOR SELECT TO authenticated
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM processes p
    WHERE p.id = tasks.process_id
    AND (p.created_by = auth.uid() OR (p.team_id IS NOT NULL AND is_team_member(p.team_id, auth.uid()))) -- check process SELECT RLS
  )
);

-- INSERT: Users can insert tasks if they can update the parent process.
CREATE POLICY "Users can create tasks if they can update parent process"
ON tasks FOR INSERT TO authenticated
WITH CHECK ( can_update_process(process_id, auth.uid()) );

-- UPDATE: Users can update tasks if they can update parent process or are assigned.
-- For assigned_to field, only process admins can change it to someone else.
-- Non-admins who are assigned can only update other fields or unassign themselves (set to NULL).
CREATE POLICY "Users can update tasks if they can update parent process or are assigned"
ON tasks FOR UPDATE TO authenticated
USING (
  assigned_to = auth.uid() OR
  can_update_process(process_id, auth.uid())
)
WITH CHECK (
    ( -- Case 1: User is admin for the process
      can_update_process(process_id, auth.uid())
    ) OR
    ( -- Case 2: User is assigned_to the task AND is not changing assigned_to to someone else
      assigned_to = auth.uid() AND
      (tasks.assigned_to IS NULL OR tasks.assigned_to = auth.uid()) -- they can unassign or keep it assigned to themselves
    )
);


-- DELETE: Users can delete tasks if they can update the parent process.
CREATE POLICY "Users can delete tasks if they can update parent process"
ON tasks FOR DELETE TO authenticated
USING ( can_update_process(process_id, auth.uid()) );


-- Modifications for 'leads' table

-- Add created_by and updated_by columns to leads
ALTER TABLE leads ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();
ALTER TABLE leads ADD COLUMN updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Trigger function to automatically update updated_by and updated_at columns
CREATE OR REPLACE FUNCTION public.set_current_user_on_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on the trigger function - typically not needed for SECURITY DEFINER, but good for clarity if ever changed.
-- GRANT EXECUTE ON FUNCTION public.set_current_user_on_update() TO authenticated; -- This is often implicit.

-- Apply the trigger to leads table
DROP TRIGGER IF EXISTS handle_updated_by_on_leads ON public.leads;
CREATE TRIGGER handle_updated_by_on_leads
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_current_user_on_update();

-- Helper Functions for 'leads' RLS

-- Checks if a user is a member of any team associated with a given property
CREATE OR REPLACE FUNCTION is_member_of_property_team(property_id_to_check UUID, user_id_to_check UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF property_id_to_check IS NULL THEN
    RETURN FALSE; -- Or TRUE, depending on desired behavior for leads not linked to a property
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM processes pr
    JOIN team_members tm ON pr.team_id = tm.team_id
    WHERE pr.property_id = property_id_to_check AND tm.user_id = user_id_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION is_member_of_property_team(UUID, UUID) TO authenticated;

-- Checks if a user is an admin of any team associated with a given property
CREATE OR REPLACE FUNCTION is_admin_of_property_team(property_id_to_check UUID, user_id_to_check UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF property_id_to_check IS NULL THEN
    RETURN FALSE; -- Or TRUE, depending on desired behavior
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM processes pr
    JOIN team_members tm ON pr.team_id = tm.team_id
    WHERE pr.property_id = property_id_to_check AND tm.user_id = user_id_to_check AND tm.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION is_admin_of_property_team(UUID, UUID) TO authenticated;

-- RLS Policies for 'leads'
-- Remove old permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;

-- SELECT: Users can view their leads or leads for properties their teams manage
CREATE POLICY "Users can view their leads or leads for properties their teams manage"
ON leads FOR SELECT TO authenticated
USING (
  created_by = auth.uid() OR
  is_member_of_property_team(property_id, auth.uid()) OR
  property_id IS NULL -- Allow users to see leads not associated with any property if they created them (covered by first condition) or if desired for all unassigned leads
);

-- INSERT: Authenticated users can create leads
CREATE POLICY "Authenticated users can create leads"
ON leads FOR INSERT TO authenticated
WITH CHECK (
    created_by = auth.uid() AND -- Ensure created_by is the current user, already defaulted
    (property_id IS NULL OR is_member_of_property_team(property_id, auth.uid()) OR is_admin_of_property_team(property_id, auth.uid())) -- Can assign to a property if member/admin of its team
);

-- UPDATE: Users can update their leads or leads for properties their teams administer
CREATE POLICY "Users can update their leads or leads for properties their teams administer"
ON leads FOR UPDATE TO authenticated
USING (
  created_by = auth.uid() OR
  is_admin_of_property_team(property_id, auth.uid())
)
WITH CHECK (
  (created_by = auth.uid() OR is_admin_of_property_team(property_id, auth.uid())) AND
  (created_by = (SELECT l.created_by FROM leads l WHERE l.id = id)) AND -- Prevent changing created_by
  ( -- Logic for changing property_id:
    (property_id IS NULL OR property_id = (SELECT l.property_id FROM leads l WHERE l.id = id)) OR -- Property not changed or changed to NULL
    (is_admin_of_property_team(property_id, auth.uid())) -- Can change to a new property if admin of new property's team
  )
);

-- DELETE: Users can delete their leads or leads for properties their teams administer
CREATE POLICY "Users can delete their leads or leads for properties their teams administer"
ON leads FOR DELETE TO authenticated
USING (
  created_by = auth.uid() OR
  is_admin_of_property_team(property_id, auth.uid())
);

// src/pages/TeamManagementPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import TeamList from '@/components/teams/TeamList';
import TeamForm from '@/components/teams/TeamForm';
import TeamMembersManager from '@/components/teams/TeamMembersManager';
import { Button } from '@/components/ui/button';
import { Team, TeamMember, User } from '@/components/teams/types';
import { PlusCircle, Users, Settings2 } from 'lucide-react'; // Icons
// import { supabase } from '@/integrations/supabase/client'; // Placeholder for Supabase client

// Mock data for demonstration - Replace with Supabase calls
const MOCK_USERS_DATA: User[] = [
    { id: 'user1', full_name: 'Alice Smith', email: 'alice@example.com', avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 'user2', full_name: 'Bob Johnson', email: 'bob@example.com', avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 'user3', full_name: 'Charlie Brown', email: 'charlie@example.com', avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 'user4', full_name: 'Diana Prince', email: 'diana@example.com', avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 'user5', full_name: 'Edward Norton', email: 'ed.norton@example.com', avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg' },
];
const MOCK_TEAMS_DATA: Team[] = [
  { id: 'team1', name: 'Alpha Squad', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'team2', name: 'Bravo Team', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'team3', name: 'Charlie Company', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
];
const MOCK_TEAM_MEMBERS_DATA: TeamMember[] = [
  { id: 'tm1', team_id: 'team1', user_id: 'user1', role: 'admin', user: MOCK_USERS_DATA[0], created_at: new Date().toISOString() },
  { id: 'tm2', team_id: 'team1', user_id: 'user2', role: 'member', user: MOCK_USERS_DATA[1], created_at: new Date().toISOString() },
  { id: 'tm3', team_id: 'team2', user_id: 'user3', role: 'admin', user: MOCK_USERS_DATA[2], created_at: new Date().toISOString() },
  { id: 'tm4', team_id: 'team1', user_id: 'user4', role: 'member', user: MOCK_USERS_DATA[3], created_at: new Date().toISOString() },
  { id: 'tm5', team_id: 'team3', user_id: 'user5', role: 'admin', user: MOCK_USERS_DATA[4], created_at: new Date().toISOString()},
];

const TeamManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    console.log("Fetching team management data...");
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: Replace with actual Supabase calls
    // const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
    // const { data: usersData, error: usersError } = await supabase.from('users').select('id, full_name, email, avatar_url'); // Or profiles table
    // const { data: teamMembersData, error: teamMembersError } = await supabase.from('team_members').select('*, user:users(id, full_name, email, avatar_url)');
    setTeams(MOCK_TEAMS_DATA);
    setAllUsers(MOCK_USERS_DATA);
    setTeamMembers(MOCK_TEAM_MEMBERS_DATA);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => { // Auto-select first team if none is selected
    if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);


  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowTeamForm(false);
    setEditingTeam(null);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setSelectedTeamId(team.id);
    setShowTeamForm(true);
  };

  const handleCreateNewTeam = () => {
    setEditingTeam(null);
    setShowTeamForm(true);
    // Optionally deselect current team to make it clear a new one is being made
    // setSelectedTeamId(null);
  };

  const handleTeamFormSubmit = async (data: Pick<Team, 'name'>) => {
    console.log('Team form data:', data);
    // TODO: Supabase insert/update for team
    if (editingTeam) {
      // const { data: updatedTeam, error } = await supabase.from('teams').update({ name: data.name }).eq('id', editingTeam.id).select().single();
      setTeams(prev => prev.map(t => t.id === editingTeam.id ? {...t, ...data, name: data.name} : t));
      alert("Team updated (mock)");
    } else {
      const newTeam = { id: `newteam_${Date.now()}`, ...data, name: data.name, created_at: new Date().toISOString() };
      // const { data: createdTeam, error } = await supabase.from('teams').insert({ name: data.name }).select().single();
      setTeams(prev => [...prev, newTeam]);
      setSelectedTeamId(newTeam.id); // Auto-select newly created team
      alert("Team created (mock)");
    }
    setShowTeamForm(false);
    setEditingTeam(null);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm("Are you sure you want to delete this team? This will also remove all its members.")) return;
    console.log('Delete team:', teamId);
    // TODO: Supabase delete team (and cascade or handle members)
    // const { error } = await supabase.from('teams').delete().eq('id', teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setTeamMembers(prev => prev.filter(tm => tm.team_id !== teamId));
    if(selectedTeamId === teamId) setSelectedTeamId(teams.length > 1 ? teams.filter(t=> t.id !== teamId)[0]?.id : null); // Select another team or null
    alert("Team deleted (mock)");
  };

  const handleAddMember = async (teamId: string, userId: string, role: 'admin' | 'member') => {
    console.log('Add member:', { teamId, userId, role });
    // TODO: Supabase insert team_member
    // const { data: newMemberData, error } = await supabase.from('team_members').insert({ team_id: teamId, user_id: userId, role }).select('*, user:users(*)').single();
    const newMember: TeamMember = {
        id: `newtm_${Date.now()}`,
        team_id: teamId,
        user_id: userId,
        role,
        user: allUsers.find(u=>u.id === userId),
        created_at: new Date().toISOString()
    };
    setTeamMembers(prev => [...prev, newMember]);
    alert("Member added (mock)");
  };

  const handleRemoveMember = async (teamMemberId: string) => {
    if (!window.confirm("Are you sure you want to remove this member from the team?")) return;
    console.log('Remove member:', teamMemberId);
    // TODO: Supabase delete team_member
    // const { error } = await supabase.from('team_members').delete().eq('id', teamMemberId);
    setTeamMembers(prev => prev.filter(tm => tm.id !== teamMemberId));
    alert("Member removed (mock)");
  };

  const handleUpdateMemberRole = async (teamMemberId: string, role: 'admin' | 'member') => {
    console.log('Update role:', { teamMemberId, role });
    // TODO: Supabase update team_member role
    // const { data: updatedMember, error } = await supabase.from('team_members').update({ role }).eq('id', teamMemberId).select('*, user:users(*)').single();
    setTeamMembers(prev => prev.map(tm => tm.id === teamMemberId ? {...tm, role} : tm));
    alert("Member role updated (mock)");
  };

  const currentTeam = teams.find(t => t.id === selectedTeamId) || null;
  const currentTeamMembers = teamMembers.filter(tm => tm.team_id === selectedTeamId);

  if (isLoading) return <div className="p-6 text-center">Loading Team Management...</div>;

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-6 bg-background min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
        <Button onClick={handleCreateNewTeam} className="flex items-center gap-2">
            <PlusCircle size={18} /> Create New Team
        </Button>
      </header>

      {showTeamForm && (
        <div className="mb-8 max-w-xl mx-auto">
            <TeamForm
              initialData={editingTeam}
              onSubmit={handleTeamFormSubmit}
              onCancel={() => { setShowTeamForm(false); setEditingTeam(null); }}
            />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Your Teams</h2>
            </div>
            <TeamList
                teams={teams}
                selectedTeamId={selectedTeamId}
                onSelectTeam={handleSelectTeam}
                onEditTeam={handleEditTeam}
                onDeleteTeam={handleDeleteTeam}
            />
        </aside>
        <main className="lg:col-span-2">
            {selectedTeamId ? (
                <TeamMembersManager
                    team={currentTeam}
                    teamMembers={currentTeamMembers}
                    allUsers={allUsers} // Pass all users for the dropdown
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                    onUpdateMemberRole={handleUpdateMemberRole}
                />
            ) : (
                 <div className="p-6 border rounded-lg shadow-sm bg-card text-center h-full flex flex-col justify-center items-center">
                    <Settings2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">Team Settings</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {teams.length > 0 ? "Select a team to view its details or manage members." : "Create a team to get started."}
                    </p>
                  </div>
            )}
        </main>
      </div>
    </div>
  );
};
export default TeamManagementPage;

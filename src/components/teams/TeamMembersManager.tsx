// src/components/teams/TeamMembersManager.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { TeamMember, User, Team } from './types';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Trash2, ShieldCheck, Users } from 'lucide-react'; // Icons
// import { supabase } from '@/integrations/supabase/client'; // Placeholder

interface TeamMembersManagerProps {
  team: Team | null;
  teamMembers: TeamMember[]; // Members for the selected team
  allUsers: User[]; // All possible users to add (already filtered in parent or pass all and filter here)
  onAddMember: (teamId: string, userId: string, role: 'admin' | 'member') => void;
  onRemoveMember: (teamMemberId: string) => void;
  onUpdateMemberRole: (teamMemberId: string, role: 'admin' | 'member') => void;
}

// Mock data for allUsers if not passed or fetched in parent (for standalone testing)
const MOCK_ALL_USERS_FALLBACK: User[] = [
    { id: 'user1', full_name: 'Alice Smith', email: 'alice@example.com' },
    { id: 'user2', full_name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 'user3', full_name: 'Charlie Brown', email: 'charlie@example.com' },
    { id: 'user4', full_name: 'Diana Prince', email: 'diana@example.com' },
    { id: 'user5', full_name: 'Edward Scissorhands', email: 'ed@example.com'},
];

const TeamMembersManager: React.FC<TeamMembersManagerProps> = ({
  team,
  teamMembers,
  allUsers = MOCK_ALL_USERS_FALLBACK, // Use fallback if prop not provided
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');

  useEffect(() => {
    // Reset add member form when team changes
    setSelectedUserId('');
    setSelectedRole('member');
  }, [team]);

  if (!team) {
    return (
      <div className="p-6 border rounded-lg shadow-sm bg-card text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Select a Team</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a team from the list to view and manage its members.
        </p>
      </div>
    );
  }

  const availableUsersToAdd = allUsers.filter(u => !teamMembers.some(tm => tm.user_id === u.id));

  const handleAddMember = () => {
    if (!selectedUserId || !team) {
        alert("Please select a user to add."); // Basic validation
        return;
    }
    onAddMember(team.id, selectedUserId, selectedRole);
    setSelectedUserId(''); // Reset form
  };

  const getUserDetails = (userId: string): User | undefined => {
    // First check if user details are embedded in teamMembers prop
    const memberWithUser = teamMembers.find(tm => tm.user_id === userId && tm.user);
    if (memberWithUser && memberWithUser.user) return memberWithUser.user;
    // Fallback to allUsers list
    return allUsers.find(u => u.id === userId);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email[0].toUpperCase();
    return '?';
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold text-foreground">Manage Members: <span className="text-primary">{team.name}</span></h3>

      {/* Add Member Form */}
      <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2 p-3 border rounded-md bg-slate-50">
        <div className="flex-grow w-full sm:w-auto">
          <Label htmlFor="selectUser" className="text-sm font-medium text-muted-foreground">User</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="selectUser" className="mt-1">
              <SelectValue placeholder="Select user to add" />
            </SelectTrigger>
            <SelectContent>
              {availableUsersToAdd.length > 0 ? availableUsersToAdd.map(user => (
                <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-2">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="text-xs">{getInitials(user.full_name, user.email)}</AvatarFallback>
                        </Avatar>
                        {user.full_name || user.email}
                    </div>
                </SelectItem>
              )) : <div className="p-2 text-sm text-muted-foreground">No users available to add.</div>}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[120px]">
          <Label htmlFor="selectRole" className="text-sm font-medium text-muted-foreground">Role</Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'admin' | 'member')}>
            <SelectTrigger id="selectRole" className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddMember} disabled={!selectedUserId || !team} className="w-full sm:w-auto whitespace-nowrap">
          <UserPlus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      {/* Members List */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>{teamMembers.length === 0 ? "No members in this team yet." : `Members of ${team.name}`}</TableCaption>
          <TableHeader><TableRow>
            <TableHead>User</TableHead>
            <TableHead className="w-[150px]">Role</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {teamMembers.map(member => {
              const user = getUserDetails(member.user_id);
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback>{getInitials(user?.full_name, user?.email)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user?.full_name || 'Unknown User'}</div>
                            <div className="text-xs text-muted-foreground">{user?.email || member.user_id}</div>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={member.role} onValueChange={(newRole) => onUpdateMemberRole(member.id, newRole as 'admin' | 'member')}>
                       <SelectTrigger className="w-full sm:w-32">
                            <div className="flex items-center">
                                {member.role === 'admin' ? <ShieldCheck className="h-4 w-4 mr-2 text-green-600" /> : <Users className="h-4 w-4 mr-2 text-gray-500" />}
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="member"><div className="flex items-center"><Users className="h-4 w-4 mr-2 text-gray-500" />Member</div></SelectItem>
                         <SelectItem value="admin"><div className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-green-600" />Admin</div></SelectItem>
                       </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => onRemoveMember(member.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Member</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default TeamMembersManager;

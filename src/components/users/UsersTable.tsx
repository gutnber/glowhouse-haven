
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserRoleSelect } from "./UserRoleSelect"
import { EditableEmail } from "./EditableEmail"

interface UsersTableProps {
  profiles: Array<{
    id: string
    email: string | null
    full_name: string | null
  }>
  userRoles: Array<{
    user_id: string
    role: "admin" | "user"
  }>
  onRefetch: () => Promise<void>
}

export const UsersTable = ({ profiles, userRoles, onRefetch }: UsersTableProps) => {
  const { toast } = useToast()

  const handlePasswordReset = async (userId: string) => {
    try {
      // First get the user's email
      const user = profiles?.find(profile => profile.id === userId)
      if (!user?.email) {
        throw new Error("User email not found")
      }

      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: user.email,
      })
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Password reset email sent",
      })
    } catch (error) {
      console.error("Error sending password reset:", error)
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles?.map((profile) => {
            const userRole = userRoles?.find(
              (role) => role.user_id === profile.id
            )
            const isMainAdmin = profile.id === "help@ignishomes.com"

            return (
              <TableRow key={profile.id}>
                <TableCell>{profile.id}</TableCell>
                <TableCell>
                  {profile.full_name || "No name provided"}
                  {isMainAdmin && (
                    <Badge variant="secondary" className="ml-2">
                      Admin
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <EditableEmail
                    userId={profile.id}
                    initialEmail={profile.email || ""}
                    onEmailUpdate={onRefetch}
                  />
                </TableCell>
                <TableCell>
                  <UserRoleSelect
                    userId={profile.id}
                    initialRole={userRole?.role || "user"}
                    isMainAdmin={isMainAdmin}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePasswordReset(profile.id)}
                  >
                    Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

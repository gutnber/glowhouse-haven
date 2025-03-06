
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
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})

  const handlePasswordReset = async (userId: string) => {
    setIsLoading(prev => ({ ...prev, [userId]: true }))
    try {
      const profile = profiles.find(p => p.id === userId)
      if (!profile?.email) {
        throw new Error("User email not found")
      }

      const { error } = await supabase.auth.resetPasswordForEmail(profile.email)
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
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => {
            const userRole = userRoles.find(
              (role) => role.user_id === profile.id
            )
            const isMainAdmin = profile.email === "help@ignishomes.com"

            return (
              <TableRow key={profile.id}>
                <TableCell>
                  {profile.full_name || "No name provided"}
                  {isMainAdmin && (
                    <Badge variant="secondary" className="ml-2">
                      Main Admin
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
                    onRoleUpdate={onRefetch}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePasswordReset(profile.id)}
                    disabled={isLoading[profile.id]}
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

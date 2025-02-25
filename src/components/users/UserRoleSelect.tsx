
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type AppRole = "admin" | "user"

interface UserRoleSelectProps {
  userId: string
  initialRole?: AppRole
  isMainAdmin?: boolean
}

export const UserRoleSelect = ({ userId, initialRole = "user", isMainAdmin }: UserRoleSelectProps) => {
  const { toast } = useToast()
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const updateUserRole = async (newRole: AppRole) => {
    console.log('Updating role for user:', userId, 'to:', newRole)
    setUpdatingUserId(userId)
    try {
      // First, get all roles for this user
      const { data: existingRoles, error: fetchError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)

      if (fetchError) throw fetchError

      console.log('Existing roles found:', existingRoles)

      // Delete any existing roles for this user
      if (existingRoles && existingRoles.length > 0) {
        console.log('Deleting existing roles')
        const { error: deleteError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
        
        if (deleteError) throw deleteError
      }

      // Insert the new role
      console.log('Inserting new role')
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole })

      if (insertError) throw insertError

      toast({
        title: "Success",
        description: "User role updated successfully",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setUpdatingUserId(null)
    }
  }

  if (isMainAdmin) {
    return <Badge>Admin</Badge>
  }

  return (
    <Select
      disabled={updatingUserId === userId}
      value={initialRole}
      onValueChange={(value: AppRole) => updateUserRole(value)}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

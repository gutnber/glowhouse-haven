
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
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type AppRole = "admin" | "user"

interface UserRoleSelectProps {
  userId: string
  initialRole?: AppRole
  isMainAdmin?: boolean
  onRoleUpdate?: () => Promise<void>
}

export const UserRoleSelect = ({ 
  userId, 
  initialRole = "user", 
  isMainAdmin,
  onRoleUpdate 
}: UserRoleSelectProps) => {
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<AppRole>(initialRole)
  const [currentRole, setCurrentRole] = useState<AppRole>(initialRole)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showApplyButton, setShowApplyButton] = useState(false)

  const updateUserRole = async () => {
    if (selectedRole === currentRole) {
      setShowApplyButton(false)
      return
    }

    console.log('Updating role for user:', userId, 'to:', selectedRole)
    setIsUpdating(true)
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
        .insert({ user_id: userId, role: selectedRole })

      if (insertError) throw insertError

      // Update local state
      setCurrentRole(selectedRole)
      setShowApplyButton(false)
      
      // Callback to refresh the parent component
      if (onRoleUpdate) {
        await onRoleUpdate()
      }

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
      setIsUpdating(false)
    }
  }

  // If this is the main admin, just show a badge
  if (isMainAdmin) {
    return <Badge>Admin</Badge>
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        disabled={isUpdating}
        value={selectedRole}
        onValueChange={(value: AppRole) => {
          setSelectedRole(value)
          setShowApplyButton(value !== currentRole)
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {showApplyButton && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={updateUserRole}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      )}
    </div>
  )
}

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserCog } from "lucide-react"

type AppRole = "admin" | "user"

const Users = () => {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin()
  const { toast } = useToast()
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const { data: profiles, isLoading: isProfilesLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
      if (error) throw error
      return profiles
    },
    enabled: isAdmin,
  })

  const { data: userRoles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
      if (error) throw error
      return data
    },
  })

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    setUpdatingUserId(userId)
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: userId, 
          role: newRole 
        })

      if (error) throw error

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

  if (isAdminLoading || isProfilesLoading || isRolesLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <UserCog className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Admin Access Required</h1>
        <p className="text-muted-foreground">
          You need admin privileges to view this page.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => {
              const userRole = userRoles?.find(
                (role) => role.user_id === profile.id
              )
              return (
                <TableRow key={profile.id}>
                  <TableCell>{profile.id}</TableCell>
                  <TableCell>
                    {profile.full_name || "No name provided"}
                    {profile.id === "help@ignishomes.com" && (
                      <Badge variant="secondary" className="ml-2">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {profile.id === "help@ignishomes.com" ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Select
                        disabled={updatingUserId === profile.id}
                        value={userRole?.role || "user"}
                        onValueChange={(value: AppRole) => updateUserRole(profile.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Users
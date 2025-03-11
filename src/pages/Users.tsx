
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Loader2, UserCog } from "lucide-react"
import { CreateUserDialog } from "@/components/users/CreateUserDialog"
import { UsersTable } from "@/components/users/UsersTable"

const Users = () => {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin()

  const { data: profiles, isLoading: isProfilesLoading, refetch: refetchProfilesOriginal } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
      
      if (error) {
        console.error("Error fetching profiles:", error)
        throw error
      }
      
      return data || []
    },
    enabled: isAdmin,
  })

  const { data: userRoles, isLoading: isRolesLoading, refetch: refetchRoles } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
      
      if (error) {
        console.error("Error fetching user roles:", error)
        throw error
      }
      
      return data || []
    },
    enabled: isAdmin,
  })

  const refetchProfiles = async () => {
    await refetchProfilesOriginal()
    await refetchRoles()
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
        <CreateUserDialog onUserCreated={refetchProfiles} />
      </div>

      <UsersTable
        profiles={profiles || []}
        userRoles={userRoles || []}
        onRefetch={refetchProfiles}
      />
    </div>
  )
}

export default Users

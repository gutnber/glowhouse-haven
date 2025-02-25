
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
import { Loader2, UserCog, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

type AppRole = "admin" | "user"

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
})

const Users = () => {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin()
  const { toast } = useToast()
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [editingEmail, setEditingEmail] = useState<{ id: string; email: string } | null>(null)

  const createUserForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
    },
  })

  const { data: profiles, isLoading: isProfilesLoading, refetch: refetchProfiles } = useQuery({
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

  const handleEmailUpdate = async (userId: string, newEmail: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email: newEmail,
      })
      if (error) throw error
      
      await refetchProfiles()
      setEditingEmail(null)
      toast({
        title: "Success",
        description: "Email updated successfully",
      })
    } catch (error) {
      console.error("Error updating email:", error)
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      })
    }
  }

  const handlePasswordReset = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        id: userId,
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

  const handleCreateUser = async (values: z.infer<typeof createUserSchema>) => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        user_metadata: { full_name: values.full_name },
      })
      if (error) throw error

      await refetchProfiles()
      setIsCreatingUser(false)
      createUserForm.reset()
      toast({
        title: "Success",
        description: "User created successfully",
      })
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
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
        <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <Form {...createUserForm}>
              <form onSubmit={createUserForm.handleSubmit(handleCreateUser)} className="space-y-4">
                <FormField
                  control={createUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createUserForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createUserForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create User</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
                    {editingEmail?.id === profile.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingEmail.email}
                          onChange={(e) =>
                            setEditingEmail({ id: profile.id, email: e.target.value })
                          }
                          className="w-48"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleEmailUpdate(profile.id, editingEmail.email)
                          }
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingEmail(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {profile.email}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setEditingEmail({ id: profile.id, email: profile.email || "" })
                          }
                        >
                          Edit
                        </Button>
                      </div>
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
    </div>
  )
}

export default Users


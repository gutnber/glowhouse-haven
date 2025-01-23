import { useState, useEffect } from "react"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { Home, Settings, Users, Building2, LogIn, LogOut } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const RootLayout = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">My App</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/properties">
                        <Building2 className="h-4 w-4" />
                        <span>Properties</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {session && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/users">
                            <Users className="h-4 w-4" />
                            <span>Users</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/settings">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border">
            {session ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsAuthDialogOpen(true)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </Sidebar>
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-4" />
          <Outlet />
        </main>
      </div>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </SidebarProvider>
  )
}

export default RootLayout
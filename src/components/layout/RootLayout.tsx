import { useState, useEffect } from "react"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { Home, Settings, Users, Building2, LogIn, LogOut } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"

const RootLayout = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { isAdmin } = useIsAdmin()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session state:", session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    console.log("Starting sign out process...")
    try {
      // First try to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Supabase signout error:", error)
        // Even if Supabase signout fails, we'll continue to clear local state
      } else {
        console.log("Supabase signout successful")
      }

      // Clear local session state after Supabase attempt
      setSession(null)
      
      toast({
        title: "Success",
        description: "You have been signed out",
      })
      navigate("/")
    } catch (error) {
      console.error("Error in signout flow:", error)
      // Ensure we clear local state even if there's an error
      setSession(null)
      toast({
        title: "Notice",
        description: "You have been signed out",
      })
      navigate("/")
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
                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/users">
                          <Users className="h-4 w-4" />
                          <span>Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {session && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/settings">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
import { useState, useEffect } from "react"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { Home, Settings, Users, Building2, LogIn, LogOut, Wrench, Moon, Sun } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useTheme } from "next-themes"

export const RootLayout = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg")
  const { toast } = useToast()
  const navigate = useNavigate()
  const { isAdmin } = useIsAdmin()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('logo_url')
          .single()

        if (error) {
          console.error('Error fetching logo:', error)
          return
        }

        if (data?.logo_url) {
          console.log('Setting logo from database:', data.logo_url)
          setLogoUrl(data.logo_url)
        }
      } catch (error) {
        console.error('Error in fetchLogo:', error)
      }
    }

    fetchLogo()
  }, [])

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
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Supabase signout error:", error)
      } else {
        console.log("Supabase signout successful")
      }

      setSession(null)
      
      toast({
        title: "Success",
        description: "You have been signed out",
      })
      navigate("/")
    } catch (error) {
      console.error("Error in signout flow:", error)
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
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-full flex justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="max-h-[100px] w-auto transition-all duration-300 hover:scale-105"
              />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-sidebar-primary to-sidebar-accent-foreground bg-clip-text text-transparent">
                My App
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/" className="group transition-all duration-300 hover:translate-x-1">
                        <Home className="h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                        <span className="transition-colors group-hover:text-sidebar-primary">Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/properties" className="group transition-all duration-300 hover:translate-x-1">
                        <Building2 className="h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                        <span className="transition-colors group-hover:text-sidebar-primary">Properties</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {isAdmin && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/users" className="group transition-all duration-300 hover:translate-x-1">
                            <Users className="h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                            <span className="transition-colors group-hover:text-sidebar-primary">Users</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/tools" className="group transition-all duration-300 hover:translate-x-1">
                            <Wrench className="h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                            <span className="transition-colors group-hover:text-sidebar-primary">Tools</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                  {session && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/settings" className="group transition-all duration-300 hover:translate-x-1">
                          <Settings className="h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                          <span className="transition-colors group-hover:text-sidebar-primary">Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-sidebar-border">
            {session ? (
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-300 hover:translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                <span className="transition-colors group-hover:text-sidebar-primary">Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-300 hover:translate-x-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
                onClick={() => setIsAuthDialogOpen(true)}
              >
                <LogIn className="mr-2 h-4 w-4 transition-colors group-hover:text-sidebar-primary" />
                <span className="transition-colors group-hover:text-sidebar-primary">Sign In</span>
              </Button>
            )}
          </div>
        </Sidebar>
        <main className="flex-1 p-6">
          <SidebarTrigger className="mb-4 bg-gradient-to-r from-sidebar-primary to-sidebar-accent hover:from-sidebar-accent hover:to-sidebar-primary text-sidebar-primary-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-sidebar-primary/50 active:scale-95 border-none h-9 w-9 rounded-lg" />
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
